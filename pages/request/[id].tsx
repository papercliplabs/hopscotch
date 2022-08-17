import { useRouter } from "next/router";
import { Button, Center, Container, Flex, Spacer, Text, Tooltip } from "@chakra-ui/react";
import { useAccount, useBalance } from "wagmi";
import { useMemo, useState } from "react";
import { useGetInvoiceQuery } from "@/graphql/generated/graphql";
import { useConnectModal } from "@papercliplabs/rainbowkit";

import { shortAddress } from "@/common/utils";
import { Length, SwapRouteState } from "@/common/types";
import { Token } from "@/common/types";
import TokenSelector from "@/components/TokenSelector";
import { BigNumber, ethers } from "ethers";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { useExactOutputSwap } from "@/hooks/useExactOutputSwap";
import { useTokenFromAddress } from "@/hooks/useTokenFromAddress";

const RequestPage = () => {
  const { query } = useRouter();
  const id = query.id;

  const { address } = useAccount();

  const [selectedInputToken, setSelectedInputToken] = useState<Token | undefined>(undefined);
  const { data: invoiceData, loading, error } = useGetInvoiceQuery({ variables: { id }, skip: !id });
  const { openConnectModal } = useConnectModal();

  const requestData = useMemo(() => invoiceData?.invoices_by_pk, [invoiceData]);
  const requestAmount = useMemo(
    () => (requestData ? BigNumber.from(requestData.recipient_token_amount) : undefined),
    [requestData]
  );
  const receipientAddress = useMemo(() => requestData?.owner?.public_key, [requestData]);

  const outputToken = useTokenFromAddress(requestData?.recipient_token_address, requestData?.chain_id);

  const {
    swapRouteState,
    swapRoute,
    transaction: swapTransaction,
    executeSwap,
  } = useExactOutputSwap(
    selectedInputToken?.address,
    requestData?.recipient_token_address,
    requestAmount,
    receipientAddress
  );
  console.log(swapTransaction);

  const quotedInputAmount = useMemo(() => {
    const quotedInputAmountString = swapRoute?.quote?.quotient.toString();
    return quotedInputAmountString ? BigNumber.from(quotedInputAmountString) : undefined;
  }, [swapRoute]);

  const {
    requiresApproval,
    approve,
    transaction: approveTransation,
  } = useApproveErc20ForSwap(selectedInputToken?.address, quotedInputAmount);

  const { data: balance, error: berror } = useBalance({
    addressOrName: address,
    token: selectedInputToken?.address,
    enabled: selectedInputToken != undefined,
  });

  const hasSufficentFunds = useMemo(() => {
    let ret = false;

    if (balance && quotedInputAmount) {
      ret = balance.value.gte(quotedInputAmount);
    }

    return ret;
  }, [balance, quotedInputAmount]);

  const transactionPending = approveTransation?.status == "pending" || swapTransaction?.status == "pending";

  // Compute the button state
  const { buttonText, onClickFunction } = useMemo(() => {
    if (!address) {
      return { buttonText: "Connect Wallet", onClickFunction: openConnectModal };
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
  if (!invoiceData || !invoiceData.invoices_by_pk || !requestData || !outputToken) {
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
              <Tooltip label={invoiceData.invoices_by_pk.owner.public_key}>
                {shortAddress(invoiceData.invoices_by_pk.owner.public_key, Length.MEDIUM)}
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
              <TokenSelector selectedTokenCallback={setSelectedInputToken} />
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
                {ethers.utils.formatUnits(BigNumber.from(requestData.recipient_token_amount), 18)} {outputToken.symbol}
              </Text>
            </Flex>
            <Flex align="center">{shortAddress(requestData.owner.public_key, Length.MEDIUM)}</Flex>
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
