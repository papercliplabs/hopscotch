import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient, Address } from "wagmi";
import { CurrencyAmount, TradeType, Percent, Token as UniswapToken } from "@uniswap/sdk-core";
import { JSBI } from "@uniswap/sdk";
import { AlphaRouter, SwapRoute, SwapOptionsSwapRouter02, SwapType } from "@uniswap/smart-order-router";

import useSendTransaction, { SendTransactionResponse } from "@/hooks/transactions/useSendTransaction";
import { HOPSCOTCH_ADDRESS, V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";
import { LoadingStatus } from "@/common/types";
import { useToken } from "@/hooks/useTokenList";
import { encodeFunctionData, zeroAddress } from "viem";
import { getNativeTokenAddress, getWrappedTokenAddress } from "@/common/utils";
import HopscotchAbi from "@/abis/hopscotch.json";
import { useRequest } from "@/hooks/useRequest";
import { useEthersProvider } from "../useEthersProvider";

export interface SwapQuote {
    quoteStatus: LoadingStatus;
    quoteAmount?: bigint;
    estimatedGas?: bigint;
    tokenAddressRoute?: string[];
    poolAddressRoute?: string[];
}

/**
 * Hook to get quote for exact output swap, and provides a callback to execute the quoted swap.
 * @returns
 *    swapQuote: quote for the swap, only valid if quoteStatus = SUCCESS
 *    transaction: swap transaction from executeSwap
 *    pendingConfirmation: if the transaction is pending confirmation in a wallet
 *    executeSwap: execute the swap for the current swapRoute quote
 *    clearTransaction: clear the transaction if one exists, this is useful if it failed and requires a retry
 */
export default function usePayRequest(
    chainId?: number,
    requestId?: bigint,
    inputTokenAddress?: Address
): SendTransactionResponse & { swapQuote: SwapQuote } {
    const [swapRoute, setSwapRoute] = useState<SwapRoute | undefined>(undefined);

    const [quoteStatus, setQuoteStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);

    const publicClient = usePublicClient({ chainId: chainId });
    const ethersProvider = useEthersProvider({ chainId: chainId });
    const { address } = useAccount();

    const request = useRequest(chainId, requestId);

    const [outputTokenAddress, outputTokenAmount] = useMemo(() => {
        return [request?.recipientTokenAddress, request?.recipientTokenAmount];
    }, [request]);

    const inputTokenAddressInternal = useMemo(() => {
        const nativeTokenAddress = getNativeTokenAddress(chainId);
        return nativeTokenAddress == inputTokenAddress ? zeroAddress : inputTokenAddress;
    }, [inputTokenAddress, chainId]);

    const [inputIsNative, outputIsNative, erc20InputTokenAddress, erc20OutputTokenAddress] = useMemo(() => {
        const wrappedNativeTokenAddress = getWrappedTokenAddress(chainId);
        const inputIsNative = inputTokenAddressInternal == zeroAddress;
        const outputIsNative = outputTokenAddress == zeroAddress;
        const erc20InputTokenAddress = inputIsNative ? wrappedNativeTokenAddress : inputTokenAddress;
        const erc20OutputTokenAddress = outputIsNative ? wrappedNativeTokenAddress : outputTokenAddress;
        return [inputIsNative, outputIsNative, erc20InputTokenAddress, erc20OutputTokenAddress];
    }, [inputTokenAddressInternal, outputTokenAddress, chainId]);

    const erc20InputToken = useUniswapToken(erc20InputTokenAddress, chainId);
    const erc20OutputToken = useUniswapToken(erc20OutputTokenAddress, chainId);

    ////
    // Get route quote
    ////
    useEffect(() => {
        async function getRoute() {
            // Prevent re-fetching the same quote
            const sameQuote =
                swapQuote.tokenAddressRoute && erc20InputTokenAddress && erc20OutputTokenAddress
                    ? swapQuote.tokenAddressRoute[0].toLowerCase() == erc20InputTokenAddress.toLowerCase() &&
                      swapQuote.tokenAddressRoute[swapQuote.tokenAddressRoute.length - 1].toLowerCase() ==
                          erc20OutputTokenAddress.toLowerCase()
                    : false;

            if (erc20InputToken && erc20OutputToken && outputTokenAmount && chainId && publicClient && !sameQuote) {
                // Set loading, and clear the last quote
                setQuoteStatus(LoadingStatus.LOADING);
                setSwapRoute(undefined);

                if (erc20InputToken.address == erc20OutputToken.address) {
                    // Direct send or just wrap / unwrap
                    setQuoteStatus(LoadingStatus.SUCCESS);
                } else {
                    const router = new AlphaRouter({ chainId: chainId, provider: ethersProvider as any });

                    const outputCurrencyAmount = CurrencyAmount.fromRawAmount(
                        erc20OutputToken,
                        JSBI.BigInt(outputTokenAmount.toString())
                    );

                    const options: SwapOptionsSwapRouter02 = {
                        recipient: HOPSCOTCH_ADDRESS,
                        slippageTolerance: new Percent(150, 10_000), // 1.5%
                        deadline: Math.floor(Date.now() / 1000 + 1800),
                        type: SwapType.SWAP_ROUTER_02,
                    };

                    let route = undefined;
                    try {
                        route = await router.route(
                            outputCurrencyAmount,
                            erc20InputToken,
                            TradeType.EXACT_OUTPUT,
                            options
                        );
                    } catch (error) {
                        console.log("ERROR HERE", error);
                    }

                    if (route) {
                        setSwapRoute(route);
                        setQuoteStatus(LoadingStatus.SUCCESS);
                    } else {
                        setQuoteStatus(LoadingStatus.ERROR);
                    }
                }
            }
        }

        getRoute();
    }, [publicClient, erc20InputToken, erc20OutputToken, outputTokenAmount, chainId]);

    ////
    // Compute transaction request
    ////
    const transactionRequest = useMemo(() => {
        let request = undefined;
        if (erc20InputToken && erc20OutputToken && address && requestId) {
            let swapContractAddress: any = zeroAddress;
            let swapContractCallData = "0x";

            let inputTokenAmount = outputTokenAmount; // If native, gets updated below if now
            if (erc20InputToken.address != erc20OutputToken.address) {
                // Swap
                swapContractAddress = V3_SWAP_ROUTER_ADDRESS;

                swapContractCallData = swapRoute?.methodParameters?.calldata ?? "0x";

                inputTokenAmount = swapRoute ? BigInt(swapRoute.quote?.quotient?.toString()) : outputTokenAmount;
            }

            const data = {
                requestId: requestId,
                inputToken: inputTokenAddressInternal,
                inputTokenAmount: inputTokenAmount,
                swapContractAddress: swapContractAddress,
                swapContractCallData: swapContractCallData,
            };

            request = {
                to: HOPSCOTCH_ADDRESS,
                from: address,
                value: inputIsNative ? inputTokenAmount : BigInt(0),
                data: encodeFunctionData({ abi: HopscotchAbi, functionName: "payRequest", args: [data] }),
                // gas: BigInt("500000"),
            };
        }
        return request;
    }, [
        swapRoute,
        erc20InputToken,
        erc20OutputToken,
        outputTokenAmount,
        address,
        requestId,
        inputTokenAddressInternal,
    ]);

    const response = useSendTransaction(
        transactionRequest,
        transactionRequest != undefined && Object.keys(transactionRequest).length != 0,
        "Pay request"
    );

    ////
    // Construct quote that works for direct transfer or swap
    ////
    const swapQuote = useMemo(() => {
        let ret: SwapQuote = {
            quoteStatus: quoteStatus,
        };

        if (erc20InputToken?.address == erc20OutputToken?.address) {
            ret.quoteAmount = outputTokenAmount;
        } else if (LoadingStatus.SUCCESS == quoteStatus && swapRoute && swapRoute.quote && swapRoute.route) {
            ret.quoteAmount = BigInt(swapRoute.quote.quotient.toString());
            ret.tokenAddressRoute = swapRoute.route[0].tokenPath.map((uniswapToken) => uniswapToken.address);
            ret.poolAddressRoute = swapRoute.route[0].poolAddresses;
        }

        return ret;
    }, [quoteStatus, swapRoute, erc20InputToken, erc20OutputToken]);

    return { ...response, swapQuote };
}

// Helper to get uniswap token for alpha router
function useUniswapToken(address?: Address, chainId?: number): UniswapToken | undefined {
    const token = useToken(address, chainId);

    return useMemo(() => {
        if (!token || !chainId) {
            return undefined;
        }

        const uniswapToken = new UniswapToken(chainId, token.address, token.decimals, token.symbol);
        return uniswapToken;
    }, [token, chainId]);
}
