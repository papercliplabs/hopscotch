import { useEffect, useMemo, useState } from "react";
import { useContract, useProvider, useSigner, useToken } from "wagmi";
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
import { SwapRouteState } from "@/common/types";

/**
 * Hook to get quote for exact output swap, and provides a callback to execute the quoted swap.
 * @param inputTokenAddress input token in the swap (from token)
 * @param outputTokenAddress output token in the swap (to token)
 * @param outputTokenAmount amount of output token required for the swap
 * @param receipientAddress address to send the output token to
 * @returns
 *    swapRouteState: state of the swap route quote
 *    swapRoute: swap route being quoted
 *    transaction: swap transaction from executeSwap
 *    executeSwap: execute the swap for the current swapRoute quote
 */
export function useExactOutputSwap(
  inputTokenAddress?: string,
  outputTokenAddress?: string,
  outputTokenAmount?: BigNumber,
  receipientAddress?: string
): {
  swapRouteState: SwapRouteState;
  swapRoute?: SwapRoute;
  sufficientFunds?: boolean;
  transaction?: Transaction;
  executeSwap: () => Promise<string>;
} {
  const [swapRoute, setSwapRoute] = useState<SwapRoute | undefined>(undefined);
  const [swapRouteState, setSwapRouteState] = useState<SwapRouteState>(SwapRouteState.INVALID);
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

  // Get route quote
  useEffect(() => {
    async function getRoute() {
      if (inputToken && outputToken && outputTokenAmount && receipientAddress) {
        const outputCurrencyAmount = CurrencyAmount.fromRawAmount(outputToken, JSBI.BigInt(outputTokenAmount));

        const router = new AlphaRouter({ chainId: chainId, provider: provider });

        const deadline = Math.floor(Date.now() / 1000 + 3600);

        // Set loading, and clear the last quote
        setSwapRouteState(SwapRouteState.LOADING);
        setSwapRoute(undefined);

        const route = await router.route(outputCurrencyAmount, inputToken, TradeType.EXACT_OUTPUT, {
          recipient: receipientAddress,
          slippageTolerance: new Percent(20, 100),
          deadline: deadline,
        });

        if (route) {
          setSwapRoute(route);
          setSwapRouteState(SwapRouteState.VALID);
        } else {
          setSwapRouteState(SwapRouteState.INVALID);
        }
      }
    }

    getRoute();
  }, [provider, inputToken, outputToken, outputTokenAmount, receipientAddress, chainId]);

  // Set transaction request
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
          console.log("NO ERROR");
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
      }

      setTranscationRequest(request);
    }

    configureTransaction();
  }, [signer, swapRoute]);

  return { swapRouteState, swapRoute, transaction, executeSwap };
}

// Helper to get uniswap token for alpha router
function useUniswapToken(address?: string, chainId?: number): UniswapToken | undefined {
  const wagmiToken = useToken({ address: address, chainId: chainId });

  return useMemo(() => {
    if (!wagmiToken.data || !chainId) {
      return undefined;
    }

    const uniswapToken = new UniswapToken(
      chainId,
      wagmiToken.data.address,
      wagmiToken.data.decimals,
      wagmiToken.data.symbol
    );
    return uniswapToken;
  }, [wagmiToken.data, chainId]);
}
