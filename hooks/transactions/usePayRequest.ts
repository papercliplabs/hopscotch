import { useEffect, useMemo, useState } from "react";
import { useAccount, Address } from "wagmi";
import { CurrencyAmount, TradeType, Percent, Token as UniswapToken } from "@uniswap/sdk-core";
import { JSBI } from "@uniswap/sdk";
import { AlphaRouter, SwapOptionsSwapRouter02, SwapType } from "@uniswap/smart-order-router";

import useSendTransaction, { SendTransactionResponse } from "@/hooks/transactions/useSendTransaction";
import { HOPSCOTCH_ADDRESS, V3_SWAP_ROUTER_ADDRESS, ZERO_X_SWAP_API_BASE_URI } from "@/common/constants";
import { LoadingStatus } from "@/common/types";
import { useToken } from "@/hooks/useTokenList";
import { encodeFunctionData, zeroAddress } from "viem";
import { getNativeTokenAddress, getWrappedTokenAddress } from "@/common/utils";
import HopscotchAbi from "@/abis/hopscotch.json";
import { useRequest } from "@/hooks/useRequest";
import { useEthersProvider } from "../useEthersProvider";

export interface SwapQuote {
    quoteAmount: bigint;
    swapContact: Address;
    swapCalldata: string;
    estimatedGas: bigint;
}

interface SwapQuoteInput {
    erc20InputTokenAddress?: Address;
    erc20OutputTokenAddress?: Address;
    chainId?: number;
    outputTokenAmount?: bigint;
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

function useUniswapSwapQuote(input?: SwapQuoteInput): { quote: SwapQuote | undefined; loadingStatus: LoadingStatus } {
    const [quote, setQuote] = useState<SwapQuote | undefined>(undefined);
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);

    const erc20InputToken = useUniswapToken(input?.erc20InputTokenAddress, input?.chainId);
    const erc20OutputToken = useUniswapToken(input?.erc20OutputTokenAddress, input?.chainId);
    const ethersProvider = useEthersProvider({ chainId: input?.chainId });

    // Get quote
    useEffect(() => {
        async function getQuote() {
            if (
                input?.chainId != undefined &&
                erc20InputToken != undefined &&
                erc20OutputToken != undefined &&
                ethersProvider != undefined &&
                input.outputTokenAmount != undefined &&
                erc20InputToken != erc20OutputToken
            ) {
                const requiresSwap =
                    input?.erc20InputTokenAddress?.toLowerCase() != input?.erc20OutputTokenAddress?.toLowerCase();

                setLoadingStatus(LoadingStatus.LOADING);
                setQuote(undefined);

                if (requiresSwap) {
                    const options: SwapOptionsSwapRouter02 = {
                        recipient: HOPSCOTCH_ADDRESS,
                        slippageTolerance: new Percent(150, 10_000), // 1.5%
                        deadline: Math.floor(Date.now() / 1000 + 1800),
                        type: SwapType.SWAP_ROUTER_02,
                    };

                    const router = new AlphaRouter({ chainId: input?.chainId, provider: ethersProvider as any });

                    const outputCurrencyAmount = CurrencyAmount.fromRawAmount(
                        erc20OutputToken,
                        JSBI.BigInt(input.outputTokenAmount.toString())
                    );

                    let route = undefined;
                    try {
                        route = await router.route(
                            outputCurrencyAmount,
                            erc20InputToken,
                            TradeType.EXACT_OUTPUT,
                            options
                        );
                    } catch (error) {
                        setLoadingStatus(LoadingStatus.ERROR);
                        console.log("UNISWAP QUOTE ERROR", error);
                    }

                    if (route) {
                        setQuote({
                            quoteAmount: BigInt(route.quote?.quotient?.toString()),
                            swapContact: V3_SWAP_ROUTER_ADDRESS,
                            swapCalldata: route.methodParameters?.calldata ?? "0x",
                            estimatedGas: BigInt(route.estimatedGasUsed.toString()),
                        });
                        setLoadingStatus(LoadingStatus.SUCCESS);
                    } else {
                        setLoadingStatus(LoadingStatus.ERROR);
                    }
                } else {
                    // No swap needed
                    setQuote({
                        quoteAmount: input.outputTokenAmount,
                        swapContact: zeroAddress,
                        swapCalldata: "0x",
                        estimatedGas: BigInt(0),
                    });
                    setLoadingStatus(LoadingStatus.SUCCESS);
                }
            }
        }

        getQuote();
    }, [input?.chainId, erc20InputToken, erc20OutputToken, ethersProvider, input?.outputTokenAmount]);

    return { quote, loadingStatus };
}

function use0xSwapQuote(input?: SwapQuoteInput): { quote: SwapQuote | undefined; loadingStatus: LoadingStatus } {
    const [quote, setQuote] = useState<SwapQuote | undefined>(undefined);
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);

    const erc20InputToken = useToken(input?.erc20InputTokenAddress, input?.chainId);
    const erc20OutputToken = useToken(input?.erc20OutputTokenAddress, input?.chainId);

    useEffect(() => {
        async function getQuote() {
            if (input?.outputTokenAmount && input?.chainId && erc20InputToken && erc20OutputToken) {
                setLoadingStatus(LoadingStatus.LOADING);
                setQuote(undefined);

                const requiresSwap = erc20InputToken.address.toLowerCase() != erc20OutputToken.address.toLowerCase();

                if (requiresSwap) {
                    const params = {
                        buyToken: erc20OutputToken.address,
                        sellToken: erc20InputToken.address,
                        buyAmount: input.outputTokenAmount,
                        slippagePercentage: 0.02, // 2%
                    };

                    const resRaw = await fetch(
                        ZERO_X_SWAP_API_BASE_URI.filter((d) => d.chainId == input.chainId)[0]?.uri +
                            "?" +
                            new URLSearchParams(params as any),
                        {
                            headers: {
                                "0x-api-key": process.env.NEXT_PUBLIC_ZERO_X_API_KEY,
                            },
                        }
                    );

                    const res = await resRaw.json();
                    console.log("0X quote", res);
                    if (res && res.sellAmount && res.estimatedGas && res.to) {
                        setQuote({
                            quoteAmount: (BigInt(res.sellAmount) * BigInt(103)) / BigInt(100), // Add in slippage margin, slightly over slippage percent
                            swapContact: res.to,
                            swapCalldata: res.data,
                            estimatedGas: BigInt(res.estimatedGas),
                        });
                        setLoadingStatus(LoadingStatus.SUCCESS);
                    } else {
                        setLoadingStatus(LoadingStatus.ERROR);
                    }
                } else {
                    // No swap needed
                    setQuote({
                        quoteAmount: input.outputTokenAmount,
                        swapContact: zeroAddress,
                        swapCalldata: "0x",
                        estimatedGas: BigInt(0),
                    });
                    setLoadingStatus(LoadingStatus.SUCCESS);
                }
            }
        }

        getQuote();
    }, [input?.outputTokenAmount, input?.chainId, erc20InputToken, erc20OutputToken]);

    return { quote, loadingStatus };
}

enum SwapDex {
    UNISWAP = 0,
    ZERO_X,
}

function useSwapQuote(
    dex: SwapDex,
    input?: SwapQuoteInput
): { quote: SwapQuote | undefined; loadingStatus: LoadingStatus } {
    const uniswapQuote = useUniswapSwapQuote(input);
    const zeroXSwapQuote = use0xSwapQuote(input);

    switch (dex) {
        case SwapDex.UNISWAP:
            return uniswapQuote;
        case SwapDex.ZERO_X:
            return zeroXSwapQuote;
    }
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
): SendTransactionResponse & { swapQuote?: SwapQuote; loadingStatus: LoadingStatus } {
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

    ////
    // Get route quote
    ////
    const { quote: swapQuote, loadingStatus } = useSwapQuote(SwapDex.ZERO_X, {
        erc20InputTokenAddress,
        erc20OutputTokenAddress,
        chainId,
        outputTokenAmount: request?.recipientTokenAmount,
    });

    ////
    // Compute transaction request
    ////
    const transactionRequest = useMemo(() => {
        let txRequest = undefined;
        if (
            erc20InputTokenAddress &&
            erc20OutputTokenAddress &&
            address &&
            requestId &&
            loadingStatus == LoadingStatus.SUCCESS &&
            swapQuote?.quoteAmount != undefined &&
            request
        ) {
            const data = {
                requestId: requestId,
                inputToken: inputTokenAddressInternal,
                inputTokenAmount: swapQuote?.quoteAmount,
                swapContractAddress: swapQuote?.swapContact,
                swapContractCallData: swapQuote?.swapCalldata,
            };

            txRequest = {
                to: HOPSCOTCH_ADDRESS,
                from: address,
                value: inputIsNative ? swapQuote.quoteAmount : BigInt(0),
                data: encodeFunctionData({ abi: HopscotchAbi, functionName: "payRequest", args: [data] }),
                // gas: swapQuote.estimatedGas ? swapQuote.estimatedGas + BigInt(50000) : BigInt("800000"),
                // gas: BigInt("800000"),
            };

            console.log("PAY TXN REQ", txRequest, data);
        }
        return txRequest;
    }, [
        swapQuote,
        erc20InputTokenAddress,
        erc20OutputTokenAddress,
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

    return { ...response, swapQuote, loadingStatus };
}
