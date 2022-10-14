import { useRouter } from "next/router";
import { Avatar, Button, Center, Container, Flex, GridItem, Spacer, Text, Tooltip } from "@chakra-ui/react";
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { Request_Status_Enum } from "@/graphql/generated/graphql";
import { useConnectModal } from "@papercliplabs/rainbowkit";

import { formatNumber, getChainForId, shortAddress } from "@/common/utils";
import { Length, LoadingStatus } from "@/common/types";
import { Token } from "@/common/types";
import { BigNumber, ethers } from "ethers";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";
import { SwapType, useExactOutputSwap } from "@/hooks/useExactOutputSwap";
import { useToken } from "@/hooks/useTokenList";
import { useRequestData } from "@/hooks/useRequestData";
import { PrimaryCardGrid } from "@/layouts/PrimaryCardGrid";
import TokenSelect from "@/components/TokenSelect";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import Image from "next/image";

const RequestPage = () => {
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);

  const { query } = useRouter();
  const id = query.id;
  const { requestData, updateRequestStatus } = useRequestData(id as string);

  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchNetwork } = useSwitchNetwork();

  const onExpectedChain = useIsOnExpectedChain(requestData?.chainId);

  const requestedChain = getChainForId(requestData?.chainId);

  const outputToken = useToken(requestData?.recipientTokenAddress, requestData?.chainId);

  const {
    swapQuote,
    transaction: swapTransaction,
    executeSwap,
  } = useExactOutputSwap(
    selectedToken?.address,
    requestData?.recipientTokenAddress,
    requestData?.recipientTokenAmount,
    requestData?.recipientAddress
  );

  const {
    requiresApproval,
    approve,
    transaction: approveTransation,
  } = useApproveErc20ForSwap(selectedToken?.address, swapQuote.quoteAmount);

  const hasSufficentFunds = useMemo(() => {
    let ret = false;

    if (selectedToken && selectedToken.balance && swapQuote.quoteAmount) {
      ret = selectedToken.balance.gte(swapQuote.quoteAmount);
    }

    return ret;
  }, [selectedToken, swapQuote.quoteAmount]);

  const transactionPending = approveTransation?.status == "pending" || swapTransaction?.status == "pending";

  // Set paid if swap is successful
  useEffect(() => {
    switch (swapTransaction?.status) {
      case "pending":
        updateRequestStatus(Request_Status_Enum.TransactionPending);
        break;

      case "failed":
        updateRequestStatus(Request_Status_Enum.Unpaid);
        break;

      case "confirmed":
        updateRequestStatus(Request_Status_Enum.Paid);
        break;
    }
  }, [swapTransaction, updateRequestStatus]);

  const etherscanLink = requestedChain?.blockExplorers?.default.url + "/tx/" + swapTransaction?.hash;
  console.log(etherscanLink);

  function openInNewTab(url: string): void {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Compute the button state
  const { buttonText, onClickFunction } = useMemo(() => {
    if (Request_Status_Enum.Paid == requestData?.status) {
      return { buttonText: "View on Etherscan", onClickFunction: () => openInNewTab(etherscanLink) };
    } else if (!address) {
      return { buttonText: "Connect Wallet", onClickFunction: openConnectModal };
    } else if (!onExpectedChain) {
      return {
        buttonText: "Wrong Network",
        onClickFunction: () => (switchNetwork ? switchNetwork(requestData?.chainId) : null),
      };
    } else if (!selectedToken) {
      return { buttonText: "Choose token", onClickFunction: undefined };
    } else if (transactionPending) {
      return { buttonText: "Pending txn", onClickFunction: undefined };
    } else if (LoadingStatus.LOADING == swapQuote.quoteStatus) {
      return { buttonText: "Fetching route", onClickFunction: undefined };
    } else if (LoadingStatus.ERROR == swapQuote.quoteStatus) {
      return { buttonText: "Route not found", onClickFunction: undefined };
    } else if (!hasSufficentFunds) {
      return { buttonText: "Insufficient funds", onClickFunction: undefined };
    } else if (requiresApproval) {
      return { buttonText: "Approve", onClickFunction: approve };
    } else {
      let text = "Pay Request";
      // switch (swapQuote.swapType) {
      //   case SwapType.SWAP:
      //     text = "Execute swap";
      //     break;
      //   case SwapType.SEND_ONLY:
      //     text = "Send";
      //     break;
      //   case SwapType.UNWRAP_AND_SEND:
      //     text = "Unwrap and send";
      //     break;
      //   case SwapType.WRAP_AND_SEND:
      //     text = "Wrap and send";
      //     break;
      // }
      return { buttonText: text, onClickFunction: executeSwap };
    }
  }, [
    requestData,
    selectedToken,
    address,
    transactionPending,
    swapQuote,
    hasSufficentFunds,
    requiresApproval,
    openConnectModal,
    approve,
    executeSwap,
  ]);

  // TODO: remove this
  if (!requestData || !outputToken) {
    return <>Loading invoice data</>;
  }

  // TODO: clean this up, for MPV
  const formattedOutputAmount = formatNumber(
    ethers.utils.formatUnits(requestData?.recipientTokenAmount, outputToken?.decimals),
    6
  );
  const quoteAmount =
    LoadingStatus.LOADING == swapQuote.quoteStatus
      ? "LOADING"
      : formatNumber(ethers.utils.formatUnits(swapQuote.quoteAmount ?? "0", selectedToken?.decimals), 6);
  const usdAmount =
    selectedToken?.priceUsd && LoadingStatus.LOADING != swapQuote.quoteStatus
      ? formatNumber(Number(quoteAmount) * selectedToken?.priceUsd, 6)
      : "--";
  const swapRate =
    LoadingStatus.LOADING == swapQuote.quoteStatus
      ? "--"
      : formatNumber(Number(quoteAmount) / Math.max(Number(formattedOutputAmount), 0.000001), 4);
  const paid = Request_Status_Enum.Paid == requestData?.status;

  return (
    <Flex direction="column" gap="16px" maxWidth="456px" justifyContent="space-between">
      <Flex
        width="100%"
        backgroundColor="bg1"
        borderRadius="sm"
        padding="3"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Text fontSize="sm" color="text0" fontWeight="bold">
          <Tooltip label={requestData?.recipientTokenAddress}>
            {shortAddress(requestData?.recipientTokenAddress, Length.MEDIUM)}
          </Tooltip>{" "}
          requested {formattedOutputAmount} {outputToken.symbol}
        </Text>
        <Text fontSize="xs" color="text1">
          Choose the token you want to pay with and it will be converted to {outputToken.symbol} before sending.
        </Text>
      </Flex>
      <PrimaryCardGrid>
        <GridItem gridRowStart={1} gridColumnStart={1} zIndex={1} height="100%" margin={0} padding={4}>
          <Flex direction="column" justifyContent="space-between" height="100%">
            {!paid ? (
              <>
                <Flex direction="column" gap="3px">
                  <Text fontSize="xl" color="text0" align="center">
                    You Pay
                  </Text>
                  <Flex
                    width="100%"
                    backgroundColor="bg1"
                    borderTopRadius="sm"
                    padding="3"
                    flexDirection="row"
                    justifyContent="space-between"
                    mt="10px"
                  >
                    <Flex direction="column" flex="1">
                      <Text fontSize="lg" color="text2">
                        {quoteAmount}
                      </Text>
                      <Text fontSize="xs" color="text2">
                        ${usdAmount}
                      </Text>
                    </Flex>

                    <Flex flexDirection="column" justifyContent="center">
                      <TokenSelect token={selectedToken} setToken={setSelectedToken} isDisabled={!onExpectedChain} />
                    </Flex>
                  </Flex>
                  <Flex
                    width="100%"
                    backgroundColor="bg1"
                    borderBottomRadius="sm"
                    padding="2"
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Flex direction="column">
                      <Text fontSize="sm" color="text2" fontWeight="bold">
                        They receive:
                      </Text>
                      <Text fontSize="xl">{formattedOutputAmount}</Text>
                    </Flex>
                    <Flex align="center">
                      <Avatar height="32px" width="32px" mr={1} src={outputToken.logoURI} />
                      <Text fontSize="md" color="text1" fontWeight="bold">
                        {outputToken.symbol}
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex direction="column" pt="10px" gap="5px">
                    <Flex direction="row" justifyContent="space-between">
                      <Text color="text1" fontWeight="bold">
                        Swap Rate
                      </Text>
                      <Text fontSize="sm">
                        1 {outputToken?.symbol} = {swapRate} {selectedToken?.symbol}
                      </Text>
                    </Flex>

                    <Flex direction="row" justifyContent="space-between">
                      <Text color="text1" fontWeight="bold">
                        Estimated Fee{" "}
                        <Tooltip label="This app currently does not take a fee from transactions. In the future it could to help support future development.">
                          <QuestionOutlineIcon />
                        </Tooltip>{" "}
                      </Text>
                      <Text fontSize="sm">Free</Text>
                    </Flex>

                    <Flex direction="row" justifyContent="space-between">
                      <Text color="text1" fontWeight="bold">
                        Network
                      </Text>
                      <Text fontSize="sm">{requestedChain?.name}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Image src={circleCheckImage} />
                <Text fontSize="xl" fontWeight="bold">
                  Request Paid
                </Text>
              </Flex>
            )}

            <Button
              mt={4}
              colorScheme="brand"
              type="submit"
              width="100%"
              size="lg"
              onClick={() => {
                onClickFunction && onClickFunction();
              }}
              borderRadius="20px"
              isDisabled={onClickFunction == undefined}
            >
              {buttonText}
            </Button>
          </Flex>
        </GridItem>
      </PrimaryCardGrid>
    </Flex>
  );
};

export default RequestPage;
