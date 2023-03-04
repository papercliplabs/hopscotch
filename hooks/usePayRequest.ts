import { useEffect, useMemo, useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { CurrencyAmount, TradeType, Percent, Token as UniswapToken } from "@uniswap/sdk-core";
import { JSBI } from "@uniswap/sdk";
import { Transaction } from "@papercliplabs/rainbowkit";
import { TransactionRequest } from "@ethersproject/providers";
import { AlphaRouter, SwapRoute, SwapOptionsSwapRouter02, SwapType } from "@uniswap/smart-order-router";

import { useSendTransaction } from "./useSendTransaction";
import { useChain } from "@/hooks/useChain";
import { HOPSCOTCH_ADDRESS, V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";

import { LoadingStatus, Token } from "@/common/types";
import { useToken } from "./useTokenList";
import { Zero } from "@ethersproject/constants";
import { getNativeTokenAddress, getWrappedTokenAddress } from "@/common/utils";
import HopscotchAbi from "@/abis/hopscotch.json";
import { useRequest } from "./useRequest";

export interface SwapQuote {
    quoteStatus: LoadingStatus;
    quoteAmount?: BigNumber;
    estimatedGas?: BigNumber;
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
export function usePayRequest(
    chainId?: number,
    requestId?: BigNumber,
    inputTokenAddress?: string
): {
    swapQuote: SwapQuote;
    transaction?: Transaction;
    pendingWalletSignature: boolean;
    abortPendingSignature: () => void;
    executeSwap: () => Promise<string>;
    clearTransaction: () => void;
} {
    const [swapRoute, setSwapRoute] = useState<SwapRoute | undefined>(undefined);
    const [quoteStatus, setQuoteStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const [transactionRequest, setTransactionRequest] = useState<TransactionRequest>({});

    const provider = useProvider({ chainId: chainId });
    const { data: signer } = useSigner();
    const { address } = useAccount();

    const request = useRequest(chainId, requestId);

    const [outputTokenAddress, outputTokenAmount] = useMemo(() => {
        return [request?.recipientTokenAddress, request?.recipientTokenAmount];
    }, [request]);

    const [inputIsNative, erc20InputTokenAddress, erc20OutputTokenAddress] = useMemo(() => {
        const nativeTokenAddress = getNativeTokenAddress(chainId);
        const wrappedNativeTokenAddress = getWrappedTokenAddress(chainId);
        const inputIsNative = nativeTokenAddress == inputTokenAddress;
        const outputIsNative = nativeTokenAddress == outputTokenAddress;
        const erc20InputTokenAddress = inputIsNative ? wrappedNativeTokenAddress : inputTokenAddress;
        const erc20OutputTokenAddress = outputIsNative ? wrappedNativeTokenAddress : outputTokenAddress;
        return [inputIsNative, erc20InputTokenAddress, erc20OutputTokenAddress];
    }, [inputTokenAddress, outputTokenAddress, chainId]);

    const erc20InputToken = useUniswapToken(erc20InputTokenAddress, chainId);
    const erc20OutputToken = useUniswapToken(erc20OutputTokenAddress, chainId);

    const {
        quotedGas,
        transaction,
        pendingWalletSignature,
        abortPendingSignature,
        sendTransaction: executeSwap,
        clearTransaction,
    } = useSendTransaction(transactionRequest, "payRequest", Object.keys(transactionRequest).length != 0);

    ////
    // Get route quote
    ////
    useEffect(() => {
        async function getRoute() {
            console.log("GETTING QUOTE");
            if (erc20InputToken && erc20OutputToken && outputTokenAmount && address && chainId && provider) {
                // Set loading, and clear the last quote
                setQuoteStatus(LoadingStatus.LOADING);
                setSwapRoute(undefined);

                if (erc20InputToken.address == erc20OutputToken.address) {
                    // Direct send or just wrap / unwrap
                    setQuoteStatus(LoadingStatus.SUCCESS);
                } else {
                    const router = new AlphaRouter({ chainId: chainId, provider: provider });

                    const outputCurrencyAmount = CurrencyAmount.fromRawAmount(
                        erc20OutputToken,
                        JSBI.BigInt(outputTokenAmount)
                    );

                    const options: SwapOptionsSwapRouter02 = {
                        recipient: HOPSCOTCH_ADDRESS,
                        slippageTolerance: new Percent(50, 10_000),
                        deadline: Math.floor(Date.now() / 1000 + 1800),
                        type: SwapType.SWAP_ROUTER_02,
                    };

                    const route = await router.route(
                        outputCurrencyAmount,
                        erc20InputToken,
                        TradeType.EXACT_OUTPUT,
                        options
                    );

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
    }, [provider, erc20InputToken, erc20OutputToken, outputTokenAmount, chainId, address]);

    ////
    // Construct quote that works for direct transfer or swap
    ////
    const swapQuote = useMemo(() => {
        let ret: SwapQuote = {
            quoteStatus: quoteStatus,
            estimatedGas: quotedGas,
        };

        if (erc20InputToken?.address == erc20OutputToken?.address) {
            ret.quoteAmount = outputTokenAmount;
        } else if (LoadingStatus.SUCCESS == quoteStatus && swapRoute && swapRoute.quote && swapRoute.route) {
            ret.quoteAmount = BigNumber.from(swapRoute.quote.quotient.toString());
            ret.tokenAddressRoute = swapRoute.route[0].tokenPath.map((uniswapToken) => uniswapToken.address);
            ret.poolAddressRoute = swapRoute.route[0].poolAddresses;
        }

        return ret;
    }, [quoteStatus, quotedGas, swapRoute, erc20InputToken, erc20OutputToken]);

    ////
    // Compute transaction request
    ////
    useEffect(() => {
        console.log("RECOMPUTING REQUEST");
        async function configureTransaction() {
            let request = {};
            if (
                signer &&
                erc20InputToken &&
                erc20OutputToken &&
                address &&
                requestId &&
                swapQuote &&
                swapQuote.quoteAmount
            ) {
                let swapContractAddress = "0x0000000000000000000000000000000000000000";
                let swapContractCallData = [];
                const contract = new ethers.Contract(HOPSCOTCH_ADDRESS, HopscotchAbi, signer);

                if (erc20InputToken.address != erc20OutputToken.address) {
                    // Swap
                    swapContractAddress = V3_SWAP_ROUTER_ADDRESS;
                    swapContractCallData = swapRoute?.methodParameters?.calldata ?? [];
                }

                const data = {
                    requestId: requestId,
                    inputToken: inputTokenAddress,
                    inputTokenAmount: swapQuote.quoteAmount,
                    swapContractAddress: swapContractAddress,
                    swapContractCallData: swapContractCallData,
                };

                console.log("PAY DATA", data);
                request = {
                    to: HOPSCOTCH_ADDRESS,
                    from: address,
                    value: inputIsNative ? swapQuote.quoteAmount : Zero,
                    data: contract.interface.encodeFunctionData("payRequest", [data]),
                    gasLimit: BigNumber.from("500000"),
                };
            } else {
                console.log(
                    "FALSE",
                    signer,
                    erc20InputToken,
                    erc20OutputToken,
                    address,
                    requestId,
                    swapQuote,
                    swapQuote.quoteAmount
                );
            }

            console.log("RECOMPUTED REQUEST", request);
            setTransactionRequest(request);
        }

        configureTransaction();
    }, [signer, swapRoute, erc20InputToken, erc20OutputToken, outputTokenAmount, address, requestId, swapQuote]);

    return { swapQuote, transaction, pendingWalletSignature, abortPendingSignature, executeSwap, clearTransaction };
}

// Helper to get uniswap token for alpha router
function useUniswapToken(address?: string, chainId?: number): UniswapToken | undefined {
    console.log("UNISWAP TOKEN", address, chainId);
    const token = useToken(address, chainId);

    return useMemo(() => {
        if (!token || !chainId) {
            return undefined;
        }

        const uniswapToken = new UniswapToken(chainId, token.address, token.decimals, token.symbol);
        return uniswapToken;
    }, [token, chainId]);
}
