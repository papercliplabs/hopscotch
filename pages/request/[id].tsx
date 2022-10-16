import { useRouter } from "next/router";
import { Avatar, Button, Flex, GridItem, Link, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useAccount, useEnsName, useSwitchNetwork } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Request_Status_Enum } from "@/graphql/generated/graphql";
import { Transaction, useConnectModal } from "@papercliplabs/rainbowkit";

import { formatNumber, getChainForId, shortAddress, openLink } from "@/common/utils";
import { ExplorerLinkType, Length, LoadingStatus } from "@/common/types";
import { Token } from "@/common/types";
import { ethers } from "ethers";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { useExactOutputSwap } from "@/hooks/useExactOutputSwap";
import { useToken } from "@/hooks/useTokenList";
import { useRequestData } from "@/hooks/useRequestData";
import { PrimaryCardGrid } from "@/layouts/PrimaryCardGrid";
import TokenSelect from "@/components/TokenSelect";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import circleFailImage from "@/public/static/CircleFail.svg";
import Image from "next/image";
import { useTransaction } from "@/hooks/useTransaction";
import { useExplorerLink } from "@/hooks/useExplorerLink";

const RequestPage = () => {
  const [inputToken, setInputToken] = useState<Token | undefined>(undefined);

  const { openConnectModal } = useConnectModal();
  const { switchNetwork } = useSwitchNetwork();

  const { query } = useRouter();
  const { requestData, updateRequestStatus } = useRequestData(query.id as string);

  const { address } = useAccount();

  const requestedChain = getChainForId(requestData?.chainId);
  const onExpectedChain = useIsOnExpectedChain(requestData?.chainId);

  const outputToken = useToken(requestData?.recipientTokenAddress, requestData?.chainId);

  const { data: recipientEnsName } = useEnsName({
    address: requestData?.recipientAddress,
    chainId: 1,
  });

  const {
    swapQuote,
    transaction: swapTransactionLocal,
    pendingConfirmation: pendingSwapConfirmation,
    executeSwap,
    clearTransaction: clearSwapTransaction,
  } = useExactOutputSwap(
    inputToken?.address,
    requestData?.recipientTokenAddress,
    requestData?.recipientTokenAmount,
    requestData?.recipientAddress
  );

  // Load previous transaction if one has already occured
  const swapTransaction = useTransaction(swapTransactionLocal?.hash ?? requestData?.transactionHash);

  const {
    requiresApproval,
    approve,
    transaction: approveTransation,
    pendingConfirmation: pendingApproveConfirmation,
    clearTransaction: clearApproveTransaction,
  } = useApproveErc20ForSwap(inputToken?.address, swapQuote.quoteAmount);

  const hasSufficentFunds = useMemo(() => {
    let ret = false;

    if (inputToken && inputToken.balance && swapQuote.quoteAmount) {
      ret = inputToken.balance.gte(swapQuote.quoteAmount);
    }

    return ret;
  }, [inputToken, swapQuote.quoteAmount]);

  const { pendingTransaction, pendingTransactionMessage } = useMemo(() => {
    if (approveTransation?.status == "pending") {
      return { pendingTransaction: approveTransation, pendingTransactionMessage: "Approving Token" };
    } else if (swapTransaction?.status == "pending") {
      return { pendingTransaction: swapTransaction, pendingTransactionMessage: "Sending Payment" };
    } else {
      return { pendingTransaction: undefined, pendingTransactionMessage: "" };
    }
  }, [approveTransation, swapTransaction]);

  const pendingTransactionConfirmation = useMemo(() => {
    return pendingApproveConfirmation || pendingSwapConfirmation;
  }, [pendingApproveConfirmation, pendingSwapConfirmation]);

  const transactionExplorerLink = useExplorerLink(
    pendingTransaction ? pendingTransaction.hash : swapTransaction?.hash,
    ExplorerLinkType.TRANSACTION,
    requestedChain
  );

  const recipientAddressExplorerLink = useExplorerLink(
    requestData?.recipientAddress,
    ExplorerLinkType.WALLET_OR_CONTRACT,
    requestedChain
  );

  const retryTransaction = useCallback(() => {
    if (approveTransation?.status == "failed") {
      clearApproveTransaction();
    } else if (swapTransaction?.status == "failed") {
      clearSwapTransaction();
      updateRequestStatus("", Request_Status_Enum.Unpaid);
    }
  }, [approveTransation, swapTransaction, clearSwapTransaction, clearApproveTransaction, updateRequestStatus]);

  // Update request status in database
  useEffect(() => {
    const hash = swapTransaction?.hash;
    if (hash) {
      switch (swapTransaction?.status) {
        case "pending":
          updateRequestStatus(hash, Request_Status_Enum.TransactionPending);
          break;

        case "failed":
          // Only mark as a fail if the transaction was previously pending (one shot fail)
          if (requestData?.status == Request_Status_Enum.TransactionPending) {
            updateRequestStatus(hash, Request_Status_Enum.Failed);
          }
          break;

        case "confirmed":
          updateRequestStatus(hash, Request_Status_Enum.Paid);
          break;
      }
    }
  }, [swapTransaction, updateRequestStatus]);

  // Compute total transaction states
  const paid = useMemo(() => {
    return swapTransaction?.status == "confirmed";
  }, [approveTransation, swapTransaction]);

  const { failed, failedMessage } = useMemo(() => {
    if (approveTransation?.status == "failed") {
      return { failed: true, failedMessage: "Approval Failed" };
    } else if (swapTransaction?.status == "failed") {
      return { failed: true, failedMessage: "Payment Failed" };
    } else {
      return { failed: false, failedMessage: "" };
    }
  }, [approveTransation, swapTransaction]);

  // Compute the primary button state
  const { primaryButtonText, primaryButtonOnClickFunction } = useMemo(() => {
    if (paid) {
      return {
        primaryButtonText: "Create your own request",
        primaryButtonOnClickFunction: () => openLink("../", false),
      };
    } else if (failed) {
      return {
        primaryButtonText: "Try Again",
        primaryButtonOnClickFunction: retryTransaction,
      };
    } else if (!address) {
      return { primaryButtonText: "Connect Wallet", primaryButtonOnClickFunction: openConnectModal };
    } else if (!onExpectedChain) {
      return {
        primaryButtonText: "Switch To " + requestedChain?.name,
        primaryButtonOnClickFunction: () => (switchNetwork ? switchNetwork(requestData?.chainId) : null),
      };
    } else if (!inputToken) {
      return { primaryButtonText: "Choose token", primaryButtonOnClickFunction: undefined };
    } else if (LoadingStatus.LOADING == swapQuote.quoteStatus) {
      return { primaryButtonText: "Fetching route", primaryButtonOnClickFunction: undefined };
    } else if (LoadingStatus.ERROR == swapQuote.quoteStatus) {
      return { primaryButtonText: "Route not found", primaryButtonOnClickFunction: undefined };
    } else if (!hasSufficentFunds) {
      return { primaryButtonText: "Insufficient funds", primaryButtonOnClickFunction: undefined };
    } else if (pendingTransactionConfirmation) {
      return { primaryButtonText: "Confirm In Wallet", primaryButtonOnClickFunction: undefined };
    } else if (requiresApproval) {
      return { primaryButtonText: "Approve", primaryButtonOnClickFunction: approve };
    } else {
      let text = "Pay Request";
      return { primaryButtonText: text, primaryButtonOnClickFunction: executeSwap };
    }
  }, [
    requestData,
    inputToken,
    address,
    pendingTransactionConfirmation,
    pendingTransaction,
    swapQuote,
    hasSufficentFunds,
    requiresApproval,
    openConnectModal,
    approve,
    paid,
    failed,
    executeSwap,
  ]);

  // TODO: remove this
  if (!requestData || !outputToken) {
    return (
      <Flex direction="column" justifyContent="center" alignItems="center" height="70vh">
        <Text>Loading request data</Text>
        <Spinner />
      </Flex>
    );
  }

  // TODO: clean this up, added for MPV
  const formattedOutputAmount = formatNumber(
    ethers.utils.formatUnits(requestData?.recipientTokenAmount, outputToken?.decimals),
    6
  );
  const quoteAmount =
    LoadingStatus.LOADING == swapQuote.quoteStatus ? (
      <Spinner size="sm" />
    ) : swapQuote.quoteAmount ? (
      formatNumber(ethers.utils.formatUnits(swapQuote.quoteAmount, inputToken?.decimals), 6)
    ) : (
      "--"
    );
  const usdAmount =
    inputToken?.priceUsd && LoadingStatus.LOADING != swapQuote.quoteStatus
      ? formatNumber(Number(quoteAmount) * inputToken?.priceUsd, 6)
      : "--";
  const swapRate =
    LoadingStatus.LOADING == swapQuote.quoteStatus ? (
      <Spinner size="sm" />
    ) : (
      formatNumber(Number(quoteAmount) / Math.max(Number(formattedOutputAmount), 0.000001), 4)
    );
  const showEtherscanButton = paid || failed || pendingTransaction;

  console.log("STATUS", requestData?.status);
  console.log("SWAP TXN", swapTransaction);

  return (
    <Flex direction="column" gap="16px" justifyContent="space-between" height="100%" alignItems="center">
      <Flex
        width="100%"
        backgroundColor="bgSecondary"
        borderRadius="md"
        padding="3"
        flexDirection="column"
        justifyContent="space-between"
        maxWidth="400px"
      >
        <Text fontSize="sm" color="textPrimary" fontWeight="bold">
          <Link href={recipientAddressExplorerLink} isExternal>
            <Tooltip label={requestData?.recipientAddress}>
              {recipientEnsName ?? shortAddress(requestData?.recipientAddress, Length.MEDIUM)}
            </Tooltip>{" "}
          </Link>
          requested {formattedOutputAmount} {outputToken.symbol}
        </Text>
        <Text fontSize="xs" color="textSecondary">
          Choose the token you want to pay with and it will be converted to {outputToken.symbol} before sending.
        </Text>
      </Flex>
      <PrimaryCardGrid>
        <GridItem gridRowStart={1} gridColumnStart={1} zIndex={1} height="100%" margin={0} padding={4}>
          <Flex direction="column" justifyContent="space-between" height="100%" gap="16px">
            {paid ? (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Image src={circleCheckImage} />
                <Text fontSize="xl" fontWeight="bold">
                  Request Paid
                </Text>
              </Flex>
            ) : pendingTransaction ? (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                <Text fontSize="xl" fontWeight="bold">
                  {pendingTransactionMessage}
                </Text>
              </Flex>
            ) : failed ? (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Image src={circleFailImage} />
                <Text fontSize="xl" fontWeight="bold">
                  {failedMessage}
                </Text>
              </Flex>
            ) : (
              <>
                <Flex direction="column" gap="3px">
                  <Text fontSize="xl" color="textPrimary" align="center">
                    You Pay
                  </Text>
                  <Flex
                    width="100%"
                    backgroundColor="bgSecondary"
                    borderTopRadius="md"
                    padding="3"
                    flexDirection="row"
                    justifyContent="space-between"
                    mt="10px"
                  >
                    <Flex direction="column" flex="1">
                      <Text fontSize="lg" color="textPrimary">
                        {quoteAmount}
                      </Text>
                      <Text fontSize="xs" color="textTertiary">
                        ${usdAmount}
                      </Text>
                    </Flex>

                    <Flex flexDirection="column" justifyContent="center">
                      <TokenSelect token={inputToken} setToken={setInputToken} isDisabled={!onExpectedChain} />
                    </Flex>
                  </Flex>
                  <Flex
                    width="100%"
                    backgroundColor="bgSecondary"
                    borderBottomRadius="md"
                    padding="2"
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Flex direction="column">
                      <Text fontSize="sm" color="textTertiary" fontWeight="bold">
                        They receive:
                      </Text>
                      <Text fontSize="xl">{formattedOutputAmount}</Text>
                    </Flex>
                    <Flex align="center">
                      <Avatar height="32px" width="32px" mr={1} src={outputToken.logoURI} />
                      <Text fontSize="md" color="textSecondary" fontWeight="bold">
                        {outputToken.symbol}
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex direction="column" pt="10px" gap="5px">
                    <Flex direction="row" justifyContent="space-between">
                      <Text color="textSecondary" fontWeight="bold">
                        Swap Rate
                      </Text>
                      <Text fontSize="sm">
                        {inputToken && outputToken ? (
                          <>
                            1 {outputToken.symbol} = {swapRate} {inputToken.symbol}
                          </>
                        ) : (
                          "--"
                        )}
                      </Text>
                    </Flex>

                    <Flex direction="row" justifyContent="space-between">
                      <Text color="textSecondary" fontWeight="bold">
                        Hopscotch Fee{" "}
                        <Tooltip label="This app currently does not take a fee from transactions. In the future it may to help support development.">
                          <QuestionOutlineIcon />
                        </Tooltip>{" "}
                      </Text>
                      <Text fontSize="sm">Free</Text>
                    </Flex>

                    <Flex direction="row" justifyContent="space-between">
                      <Text color="textSecondary" fontWeight="bold">
                        Network
                      </Text>
                      <Text fontSize="sm">{requestedChain?.name}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            )}

            {!pendingTransaction && (
              <Button
                colorScheme="brand"
                type="submit"
                width="100%"
                minHeight="48px"
                size="lg"
                onClick={() => {
                  primaryButtonOnClickFunction && primaryButtonOnClickFunction();
                }}
                isDisabled={primaryButtonOnClickFunction == undefined}
              >
                {primaryButtonText}
              </Button>
            )}

            {showEtherscanButton && (
              <Button
                colorScheme="blue"
                backgroundColor="blue.200"
                type="submit"
                width="100%"
                minHeight="48px"
                size="lg"
                onClick={() => {
                  openLink(transactionExplorerLink, true);
                }}
              >
                View in {requestedChain?.blockExplorers?.default.name}
              </Button>
            )}
          </Flex>
        </GridItem>
      </PrimaryCardGrid>
    </Flex>
  );
};

export default RequestPage;
