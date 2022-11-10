import { useRouter } from "next/router";
import { Avatar, AvatarBadge, Box, Button, Flex, GridItem, Link, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useAccount, useEnsName, useNetwork, useSwitchNetwork } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Request_Status_Enum } from "@/graphql/generated/graphql";
import { useConnectModal } from "@papercliplabs/rainbowkit";

import { formatNumber, shortAddress, openLink, formatTokenBalance } from "@/common/utils";
import { ExplorerLinkType, Length, LoadingStatus } from "@/common/types";
import { Token } from "@/common/types";
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
import { useChain } from "@/hooks/useChain";
import { EnsAvatar } from "@/components/EnsAvatar";

const RequestPage = () => {
  const [inputToken, setInputToken] = useState<Token | undefined>(undefined);

  const { openConnectModal } = useConnectModal();
  const { switchNetwork } = useSwitchNetwork();

  const { query } = useRouter();
  const { requestData, updateRequestStatus } = useRequestData(query.id as string);

  const { address } = useAccount();

  const requestedChain = useChain(requestData?.chainId);
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

  const quoteLoading = LoadingStatus.LOADING == swapQuote.quoteStatus;
  const showEtherscanButton = paid || failed || pendingTransaction;
  const isOwner = address == requestData?.recipientAddress;

  // Format numbers
  const formattedQuoteAmount = formatTokenBalance(swapQuote?.quoteAmount, inputToken?.decimals, 6);
  const inputTokenUsdAmount = formatNumber(Number(formattedQuoteAmount) * Number(inputToken?.priceUsd), 2, false);
  const formattedOutputAmount = formatTokenBalance(requestData?.recipientTokenAmount, outputToken?.decimals, 6);
  const outputTokenUsdAmount = formatNumber(Number(formattedOutputAmount) * Number(outputToken?.priceUsd), 2, false); // Unused for now (needs updated designs)
  const swapRate = formatNumber(Number(formattedQuoteAmount) / Number(formattedOutputAmount));

  return (
    <Flex direction="column" gap="12px" justifyContent="space-between" height="100%" alignItems="center">
      {isOwner && (
        <Box
          width="100%"
          backgroundColor="#D9FADE"
          color="#2ABA5A"
          borderRadius="md"
          p={4}
          flexDirection="row"
          maxWidth="400px"
        >
          <Text textAlign="center" width="100%" textStyle="titleSm">
            🎁 This is your request, share it with anyone
          </Text>
        </Box>
      )}
      <Flex
        width="100%"
        backgroundColor="bgSecondary"
        borderRadius="md"
        p={4}
        flexDirection="row"
        justifyContent="space-between"
        align="center"
        maxWidth="400px"
      >
        <EnsAvatar address={requestData?.recipientAddress} width="32px" height="32px" fontSize="sm" mr={3} />
        <Flex direction="column">
          <Text textStyle="titleSm">
            <Text as="span" variant="gradient">
              <Link href={recipientAddressExplorerLink} isExternal>
                <Tooltip label={requestData?.recipientAddress}>
                  {recipientEnsName ?? shortAddress(requestData?.recipientAddress, Length.MEDIUM)}
                </Tooltip>{" "}
              </Link>
            </Text>
            requested {formattedOutputAmount} {outputToken.symbol}
          </Text>
          <Text variant="secondary" textStyle="bodySm">
            Choose the token you want to pay with and it will be converted to {outputToken.symbol} before sending.
          </Text>
        </Flex>
      </Flex>
      <PrimaryCardGrid>
        <GridItem gridRowStart={1} gridColumnStart={1} zIndex={1} height="100%" margin={0} padding={4}>
          <Flex direction="column" justifyContent="space-between" height="100%" gap="16px">
            {paid ? (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Image src={circleCheckImage} alt="check"/>
                <Text textStyle="titleLg" mt={6}>
                  Request Paid!
                </Text>
                <Text textStyle="bodyMd" variant="secondary">
                  The request has been paid.
                </Text>
              </Flex>
            ) : pendingTransaction ? (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Spinner thickness="4px" speed="1.0s" emptyColor="gray.200" color="blue.500" boxSize="80px" mb={6} />
                <Text textStyle="titleLg">{pendingTransactionMessage}</Text>
                <Text textStyle="bodyMd" variant="secondary">
                  Please wait...
                </Text>
              </Flex>
            ) : failed ? (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Image src={circleFailImage} />
                <Text textStyle="titleLg" mt={6}>
                  {failedMessage}
                </Text>
                <Text textStyle="bodyMd" variant="secondary">
                  An error occured, please try again.
                </Text>
              </Flex>
            ) : (
              <>
                <Flex direction="column" flexGrow={1} justifyContent="space-between">
                  <Text textStyle="titleLg" align="center">
                    You Pay
                  </Text>
                  <Flex direction="column" gap="3px">
                    <Flex
                      width="100%"
                      backgroundColor="bgSecondary"
                      borderTopRadius="md"
                      paddingX={4}
                      paddingY={6}
                      flexDirection="row"
                      justifyContent="space-between"
                      mt="10px"
                    >
                      <Flex direction="column" flex="1">
                        <Text textStyle="headline">
                          {quoteLoading ? (
                            <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="sm" />
                          ) : (
                            formattedQuoteAmount
                          )}
                        </Text>
                        <Text textStyle="bodyMd" variant="secondary">
                          ${inputTokenUsdAmount}
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
                      padding={4}
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Flex direction="column">
                        <Text textStyle="titleSm" variant="secondary">
                          They receive:
                        </Text>
                        <Text textStyle="headline">{formattedOutputAmount}</Text>
                        <Text textStyle="bodyMd" variant="secondary">
                          ${outputTokenUsdAmount}
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <Avatar height="32px" width="32px" mr={2} src={outputToken.logoURI}>
                          <AvatarBadge borderWidth={2}>
                            <Image
                              src={requestedChain?.iconUrlSync}
                              alt={requestedChain?.name}
                              width="14px"
                              height="14px"
                              layout="fixed"
                              objectFit="contain"
                              className="rounded-full"
                            />
                          </AvatarBadge>
                        </Avatar>
                        <Text textStyle="titleLg">{outputToken.symbol}</Text>
                      </Flex>
                    </Flex>
                  </Flex>

                  <Flex direction="column" pt="10px" gap="5px">
                    <Flex direction="row" justifyContent="space-between">
                      <Text textStyle="label" variant="secondary" fontWeight="bold">
                        Swap Rate
                      </Text>
                      <Text fontSize="sm">
                        {inputToken && outputToken ? (
                          quoteLoading ? (
                            <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="sm" />
                          ) : (
                            <>
                              1 {outputToken.symbol} = {swapRate} {inputToken.symbol}
                            </>
                          )
                        ) : (
                          "--"
                        )}
                      </Text>
                    </Flex>

                    <Flex direction="row" justifyContent="space-between">
                      <Text textStyle="label" variant="secondary" fontWeight="bold">
                        Hopscotch Fee{" "}
                        <Tooltip label="This app currently does not take a fee from transactions. In the future it may to help support development.">
                          <QuestionOutlineIcon boxSize="12px" />
                        </Tooltip>{" "}
                      </Text>
                      <Text fontSize="sm">Free</Text>
                    </Flex>

                    <Flex direction="row" justifyContent="space-between">
                      <Text textStyle="label" variant="secondary" fontWeight="bold">
                        Network
                      </Text>
                      <Flex align="center">
                        <Image
                          src={requestedChain?.iconUrlSync}
                          alt={requestedChain?.name}
                          width={16}
                          height={16}
                          layout="fixed"
                          objectFit="contain"
                          className="rounded-full"
                        />
                        <Text fontSize="sm" pl="4px">
                          {requestedChain?.name}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            )}

            <Flex direction="column" gap="8px">
              {!pendingTransaction && (
                <Button
                  colorScheme={onExpectedChain ? "brand" : "red"}
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
                  backgroundColor="#E4F2FF"
                  color="primary"
                  type="submit"
                  width="100%"
                  minHeight="48px"
                  size="lg"
                  onClick={() => {
                    openLink(transactionExplorerLink, true);
                  }}
                >
                  View transaction
                </Button>
              )}
            </Flex>
          </Flex>
        </GridItem>
      </PrimaryCardGrid>
    </Flex>
  );
};

export default RequestPage;