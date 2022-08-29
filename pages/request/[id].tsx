import { useRouter } from "next/router";
import { Button, Center, Container, Flex, Spacer, Text, Tooltip } from "@chakra-ui/react";
import { useAccount, useBalance } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { Request_Status_Enum } from "@/graphql/generated/graphql";
import { useConnectModal } from "@papercliplabs/rainbowkit";

import { shortAddress } from "@/common/utils";
import { Length, SwapRouteState } from "@/common/types";
import { Token } from "@/common/types";
import TokenSelector from "@/components/TokenSelector";
import { BigNumber, ethers } from "ethers";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { useExactOutputSwap } from "@/hooks/useExactOutputSwap";
import { useToken } from "@/hooks/useTokenList";
import { useRequestData } from "@/hooks/useRequestData";

const RequestPage = () => {
  const [inputToken, setInputToken] = useState<Token | undefined>(undefined);

  const { query } = useRouter();
  const id = query.id;
  const { requestData, updateRequestStatus } = useRequestData(id as string);

  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const outputToken = useToken(requestData?.recipientTokenAddress, requestData?.chainId);

  const {
    swapRouteState,
    swapRoute,
    transaction: swapTransaction,
    executeSwap,
  } = useExactOutputSwap(
    inputToken?.address,
    requestData?.recipientTokenAddress,
    requestData?.recipientTokenAmount,
    requestData?.recipientAddress
  );

  const quotedInputAmount = useMemo(() => {
    const quotedInputAmountString = swapRoute?.quote?.quotient.toString();
    return quotedInputAmountString ? BigNumber.from(quotedInputAmountString) : undefined;
  }, [swapRoute]);

  const {
    requiresApproval,
    approve,
    transaction: approveTransation,
  } = useApproveErc20ForSwap(inputToken?.address, quotedInputAmount);

  const hasSufficentFunds = useMemo(() => {
    let ret = false;

    if (inputToken && inputToken.balance && quotedInputAmount) {
      ret = inputToken.balance.gte(quotedInputAmount);
    }

    return ret;
  }, [inputToken, quotedInputAmount]);

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
    } else if (!inputToken) {
      return { buttonText: "Choose token", onClickFunction: undefined };
    } else if (transactionPending) {
      return { buttonText: "Pending txn", onClickFunction: undefined };
    } else if (SwapRouteState.LOADING == swapRouteState) {
      return { buttonText: "Fetching route", onClickFunction: undefined };
    } else if (SwapRouteState.INVALID == swapRouteState) {
      return { buttonText: "Route not found", onClickFunction: undefined };
    } else if (!hasSufficentFunds) {
      return { buttonText: "Insufficient funds", onClickFunction: undefined };
    } else if (requiresApproval) {
      return { buttonText: "Approve", onClickFunction: approve };
    } else {
      return { buttonText: "Execute swap", onClickFunction: executeSwap };
    }
  }, [
    requestData,
    inputToken,
    address,
    transactionPending,
    swapRouteState,
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
    <Container width="100%" height="100vh" maxW="832px">
      <Center height="60%">
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          maxWidth="456px"
          width="100%"
          gap="0.5"
        >
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
                {SwapRouteState.LOADING == swapRouteState ? "LOADING" : swapRoute?.quote.toFixed(2)}
              </Text>
              <Text fontSize="xs" color="text2">
                Estimated gwei: {swapRoute?.estimatedGasUsed.toString()}
              </Text>
              <Text fontSize="xs" color="text2">
                Estimated gas USD: {swapRoute?.estimatedGasUsedUSD.toFixed(6)}
              </Text>
              <Text fontSize="xs" color="text2">
                Gas Adjusted Quote: {swapRoute?.quoteGasAdjusted.toFixed(2)}
              </Text>

              <Text fontSize="xs" color="text2">
                Route:{" "}
                {swapRoute?.route[0]?.tokenPath.reduce(
                  (previousValue, currentValue) => previousValue + currentValue.symbol + "->",
                  ""
                )}
              </Text>
            </Flex>

            <Flex flexDirection="column" justifyContent="center">
              <TokenSelector selectedTokenCallback={setInputToken} />
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
        </Flex>
      </Center>
    </Container>
  );
};

export default RequestPage;
