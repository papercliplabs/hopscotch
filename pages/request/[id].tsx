import { useRouter } from "next/router";
import { Button, Center, Container, Flex, GridItem, Spacer, Text, Tooltip } from "@chakra-ui/react";
import { useAccount, useBalance, useSwitchNetwork } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { Request_Status_Enum } from "@/graphql/generated/graphql";
import { useConnectModal } from "@papercliplabs/rainbowkit";

import { shortAddress } from "@/common/utils";
import { Length, LoadingStatus } from "@/common/types";
import { Token } from "@/common/types";
import { BigNumber, ethers } from "ethers";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { SwapType, useExactOutputSwap } from "@/hooks/useExactOutputSwap";
import { useToken } from "@/hooks/useTokenList";
import { useRequestData } from "@/hooks/useRequestData";
import { PrimaryCardGrid } from "@/layouts/PrimaryCardGrid";
import TokenSelect from "@/components/TokenSelect";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";

const RequestPage = () => {
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);

  const { query } = useRouter();
  const id = query.id;
  const { requestData, updateRequestStatus } = useRequestData(id as string);

  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchNetwork } = useSwitchNetwork();

  const onExpectedChain = useIsOnExpectedChain(requestData?.chainId);

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

  // Compute the button state
  const { buttonText, onClickFunction } = useMemo(() => {
    if (Request_Status_Enum.Paid == requestData?.status) {
      return { buttonText: "Request has been paid", onClickFunction: undefined };
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
      let text = "";
      switch (swapQuote.swapType) {
        case SwapType.SWAP:
          text = "Execute swap";
          break;
        case SwapType.SEND_ONLY:
          text = "Send";
          break;
        case SwapType.UNWRAP_AND_SEND:
          text = "Unwrap and send";
          break;
        case SwapType.WRAP_AND_SEND:
          text = "Wrap and send";
          break;
      }
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

  return (
    <PrimaryCardGrid>
      <GridItem gridRowStart={1} gridColumnStart={1} zIndex={1} height="100%" margin={4}>
        <Flex
          width="100%"
          backgroundColor="bg1"
          borderRadius="sm"
          padding="3"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Text fontSize="lg" color="text0" fontWeight="bold">
            <Tooltip label={requestData?.recipientTokenAddress}>
              {shortAddress(requestData?.recipientTokenAddress, Length.MEDIUM)}
            </Tooltip>{" "}
            is requesting a payment from you
          </Text>
          <Text fontSize="sm" color="text1">
            Select the token you want to pay with and it will. It will be converted to {outputToken.symbol} before
            sending.
          </Text>
        </Flex>

        <Flex
          width="100%"
          backgroundColor="bg1"
          borderTopRadius="sm"
          padding="3"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Flex direction="column" flex="1">
            <Text fontSize="xl" color="text2">
              {LoadingStatus.LOADING == swapQuote.quoteStatus ? "LOADING" : swapQuote.quoteAmount?.toString()}
            </Text>
            <Text fontSize="xs" color="text2">
              Estimated gas: {swapQuote?.estimatedGas?.toString()}
            </Text>

            {/* <Text fontSize="xs" color="text2">
                Route (token): {swapQuote.tokenAddressRoute?.reduce((state, address) => state + "->" + address)}
                Route (pool): {swapQuote.poolAddressRoute?.reduce((state, address) => state + "->" + address)}
              </Text> */}
          </Flex>

          <Flex flexDirection="column" justifyContent="center">
            <TokenSelect token={selectedToken} setToken={setSelectedToken} isDisabled={!onExpectedChain} />
          </Flex>
        </Flex>
        <Spacer height="2px" />
        <Flex
          width="100%"
          backgroundColor="bg1"
          borderBottomRadius="sm"
          padding="2"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Flex direction="column">
            <Text fontSize="sm" color="text2">
              To:
            </Text>
            <Text fontSize="xl">
              {ethers.utils.formatUnits(requestData?.recipientTokenAmount, 18)} {outputToken.symbol}
            </Text>
          </Flex>
          <Flex align="center">{shortAddress(requestData.recipientTokenAddress, Length.MEDIUM)}</Flex>
        </Flex>

        <Button
          mt={4}
          colorScheme="blue"
          type="submit"
          width="100%"
          size="lg"
          onClick={() => {
            onClickFunction && onClickFunction();
          }}
          isDisabled={onClickFunction == undefined}
        >
          {buttonText}
        </Button>
      </GridItem>
    </PrimaryCardGrid>
  );
};

export default RequestPage;
