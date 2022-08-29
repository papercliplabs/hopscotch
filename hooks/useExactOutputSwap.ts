import { useEffect, useMemo, useState } from "react";
import { erc20ABI, useContract, useProvider, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { SwapRoute } from "@uniswap/smart-order-router";
import { CurrencyAmount, TradeType, Percent, Token as UniswapToken } from "@uniswap/sdk-core";
import { JSBI } from "@uniswap/sdk";
import { Transaction } from "@papercliplabs/rainbowkit";
import { TransactionRequest } from "@ethersproject/providers";
import { AlphaRouter } from "@uniswap/smart-order-router";

import RouterABI from "@/abis/V3UniRouter.json";
import { useSendTransaction } from "./useSendTransaction";
import { useChainId } from "./useChainId";
import { V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";

import { LoadingStatus, Token } from "@/common/types";
import { useToken } from "./useTokenList";

export interface SwapQuote {
  quoteStatus: LoadingStatus;
  quoteAmount?: BigNumber;
  estimatedGas?: BigNumber;
  requiresSwap: boolean;
  tokenAddressRoute?: string[];
  poolAddressRoute?: string[];
}

/**
 * Hook to get quote for exact output swap, and provides a callback to execute the quoted swap.
 * @param inputTokenAddress input token in the swap (from token)
 * @param outputTokenAddress output token in the swap (to token)
 * @param outputTokenAmount amount of output token required for the swap
 * @param receipientAddress address to send the output token to
 * @returns
 *    swapQuote: quote for the swap, only valid if quoteStatus = SUCCESS
 *    transaction: swap transaction from executeSwap
 *    executeSwap: execute the swap for the current swapRoute quote
 */
export function useExactOutputSwap(
  inputTokenAddress?: string,
  outputTokenAddress?: string,
  outputTokenAmount?: BigNumber,
  receipientAddress?: string
): {
  swapQuote: SwapQuote;
  transaction?: Transaction;
  executeSwap: () => Promise<string>;
} {
  const [swapRoute, setSwapRoute] = useState<SwapRoute | undefined>(undefined);
  const [quoteStatus, setQuoteStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [transcationRequest, setTranscationRequest] = useState<TransactionRequest>({});

  const provider = useProvider();
  const { data: signer } = useSigner();
  const chainId = useChainId();
  const inputToken = useUniswapToken(inputTokenAddress, chainId);
  const outputToken = useUniswapToken(outputTokenAddress, chainId);
  const {
    quotedGas,
    transaction,
    sendTransaction: executeSwap,
  } = useSendTransaction(transcationRequest, "multicall", Object.keys(transcationRequest).length != 0);

  ////
  // Get route quote
  ////
  useEffect(() => {
    async function getRoute() {
      if (inputToken && outputToken && outputTokenAmount && receipientAddress) {
        const outputCurrencyAmount = CurrencyAmount.fromRawAmount(outputToken, JSBI.BigInt(outputTokenAmount));

        const router = new AlphaRouter({ chainId: chainId, provider: provider });

        const deadline = Math.floor(Date.now() / 1000 + 3600);

        // Set loading, and clear the last quote
        setQuoteStatus(LoadingStatus.LOADING);
        setSwapRoute(undefined);

        if (inputToken.address == outputToken.address) {
          // Direct send
          setQuoteStatus(LoadingStatus.SUCCESS);
        } else {
          // Compute swap route
          const route = await router.route(outputCurrencyAmount, inputToken, TradeType.EXACT_OUTPUT, {
            recipient: receipientAddress,
            slippageTolerance: new Percent(20, 100),
            deadline: deadline,
          });

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
  }, [provider, inputToken, outputToken, outputTokenAmount, receipientAddress, chainId]);

  ////
  // Compute transaction request
  ////
  useEffect(() => {
    async function configureTransaction() {
      let request = {};

      if (signer && swapRoute && swapRoute.methodParameters) {
        const calls = [];
        const value = BigNumber.from(swapRoute.methodParameters.value);
        const routerContract = new ethers.Contract(V3_SWAP_ROUTER_ADDRESS, RouterABI, signer);

        // TODO: add more here to support ETH wrap/unwrap + take fee
        calls.push(swapRoute.methodParameters.calldata);

        let gas;

        try {
          gas = await routerContract.estimateGas.multicall(calls, {
            value: value,
          });
        } catch (error) {
          console.log(error);
          gas = BigNumber.from("400000");
        }

        request = {
          to: V3_SWAP_ROUTER_ADDRESS,
          value: value,
          data: routerContract.interface.encodeFunctionData("multicall", [calls]),
          gasLimit: gas.add(BigNumber.from("20000")), // 20000 margin
        };
      } else if (
        signer &&
        inputToken &&
        outputToken &&
        receipientAddress &&
        outputTokenAmount &&
        inputToken.address == outputToken.address
      ) {
        // Just a transfer
        const contract = new ethers.Contract(inputToken.address, erc20ABI, signer);

        request = {
          to: receipientAddress,
          data: contract.interface.encodeFunctionData("transfer", [outputToken.address, outputTokenAmount]),
        };
      }

      setTranscationRequest(request);
    }

    configureTransaction();
  }, [signer, swapRoute, inputToken, outputToken, outputTokenAmount, outputTokenAddress, receipientAddress]);

  ////
  // Construct quote that works for direct transfer or swap
  ////
  const swapQuote = useMemo(() => {
    let ret: SwapQuote = {
      quoteStatus: quoteStatus,
      estimatedGas: quotedGas,
      requiresSwap: inputToken?.address != outputToken?.address,
    };

    if (!ret.requiresSwap) {
      // Direct transfer
      ret.quoteAmount = outputTokenAmount;
    } else if (LoadingStatus.SUCCESS == quoteStatus && swapRoute && swapRoute.quote && swapRoute.route) {
      // Swap route
      ret.quoteAmount = BigNumber.from(swapRoute.quote.quotient.toString());
      ret.tokenAddressRoute = swapRoute.route[0].tokenPath.map((uniswapToken) => uniswapToken.address);
      ret.poolAddressRoute = swapRoute.route[0].poolAddresses;
    }

    return ret;
  }, [quoteStatus, swapRoute, quotedGas, inputToken, outputToken]);

  return { swapQuote, transaction, executeSwap };
}

// Helper to get uniswap token for alpha router
function useUniswapToken(address?: string, chainId?: number): UniswapToken | undefined {
  const token = useToken(address, chainId);

  return useMemo(() => {
    if (!token || !chainId) {
      return undefined;
    }

    const uniswapToken = new UniswapToken(chainId, token.address, token.decimals, token.symbol);
    return uniswapToken;
  }, [token, chainId]);
}
