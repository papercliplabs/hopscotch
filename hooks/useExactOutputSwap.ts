import { useEffect, useMemo, useState } from "react";
import { erc20ABI, useAccount, useContract, useProvider, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { SwapRoute } from "@uniswap/smart-order-router";
import { CurrencyAmount, TradeType, Percent, Token as UniswapToken } from "@uniswap/sdk-core";
import { JSBI } from "@uniswap/sdk";
import { Transaction } from "@papercliplabs/rainbowkit";
import { TransactionRequest } from "@ethersproject/providers";
import { AlphaRouter } from "@uniswap/smart-order-router";

import RouterABI from "@/abis/V3UniRouter.json";
import Weth9Abi from "@/abis/WETH9.json";
import { useSendTransaction } from "./useSendTransaction";
import { useActiveChain } from "@/hooks/useActiveChain";
import { V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";

import { LoadingStatus, Token } from "@/common/types";
import { useToken } from "./useTokenList";
import { AddressZero, Zero } from "@ethersproject/constants";
import { getWrappedTokenAddress } from "@/common/utils";

export enum SwapType {
  SWAP,
  SEND_ONLY,
  WRAP_AND_SEND,
  UNWRAP_AND_SEND,
}

export interface SwapQuote {
  quoteStatus: LoadingStatus;
  quoteAmount?: BigNumber;
  estimatedGas?: BigNumber;
  swapType: SwapType;
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

  const [inputIsNative, outputIsNative] = useMemo(() => {
    return [AddressZero == inputTokenAddress, AddressZero == outputTokenAddress];
  }, [inputTokenAddress, outputTokenAddress]);

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { id: chainId } = useActiveChain();
  const inputToken = useUniswapToken(inputIsNative ? getWrappedTokenAddress(chainId) : inputTokenAddress, chainId);
  const outputToken = useUniswapToken(outputIsNative ? getWrappedTokenAddress(chainId) : outputTokenAddress, chainId);

  ////
  // Compute swap type based on inputs
  ////
  const swapType = useMemo(() => {
    let swapType = SwapType.SWAP;
    const wrappedTokenAddress = getWrappedTokenAddress(chainId);
    if (inputToken?.address == outputToken?.address) {
      if (inputIsNative && outputTokenAddress == wrappedTokenAddress) {
        swapType = SwapType.WRAP_AND_SEND;
      } else if (outputIsNative && inputTokenAddress == wrappedTokenAddress) {
        swapType = SwapType.UNWRAP_AND_SEND;
      } else {
        swapType = SwapType.SEND_ONLY;
      }
    }

    return swapType;
  }, [inputToken, outputToken, inputTokenAddress, outputTokenAddress, inputIsNative, outputIsNative]);

  console.log("SWAPTYPE!!!", swapType);

  const {
    quotedGas,
    transaction,
    sendTransaction: executeSwap,
  } = useSendTransaction(
    transcationRequest,
    swapType != SwapType.SEND_ONLY ? "multicall" : "transfer",
    Object.keys(transcationRequest).length != 0
  );

  ////
  // Get route quote
  ////
  useEffect(() => {
    async function getRoute() {
      if (inputToken && outputToken && outputTokenAmount) {
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
            recipient: V3_SWAP_ROUTER_ADDRESS,
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
  }, [provider, inputToken, outputToken, outputTokenAmount, chainId]);

  ////
  // Compute transaction request
  ////
  useEffect(() => {
    async function configureTransaction() {
      let request = {};

      if (signer && swapRoute && swapRoute.methodParameters) {
        const calls = [];
        const value = BigNumber.from(swapRoute.quote.quotient.toString());
        const routerContract = new ethers.Contract(V3_SWAP_ROUTER_ADDRESS, RouterABI, signer);

        calls.push(swapRoute.methodParameters.calldata);

        if (inputIsNative) {
          // If the input is ETH, need to call refund on router to get back any overspend
          const multi2 = routerContract.interface.encodeFunctionData("refundETH");
          calls.push(multi2);
        }

        // TODO: add taking fee here
        if (outputIsNative) {
          // If the output is ETH, need to unwrap WETH
          const multi3 = routerContract.interface.encodeFunctionData("unwrapWETH9", [
            outputTokenAmount,
            receipientAddress,
          ]);
          calls.push(multi3);
        } else {
          // Else, just sweep it as is
          const multi3 = routerContract.interface.encodeFunctionData("sweepToken", [
            outputTokenAddress,
            outputTokenAmount,
            receipientAddress,
          ]);
          calls.push(multi3);
        }

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
          value: inputIsNative ? value : Zero,
          data: routerContract.interface.encodeFunctionData("multicall", [calls]),
          gasLimit: gas.add(BigNumber.from("20000")), // 20000 margin
        };
      } else if (
        signer &&
        inputToken &&
        outputToken &&
        receipientAddress &&
        outputTokenAmount &&
        address &&
        inputToken.address == outputToken.address
      ) {
        // Just a transfer
        if (SwapType.SEND_ONLY == swapType) {
          if (inputToken.address == AddressZero) {
            // native token transfer
            request = {
              to: receipientAddress,
              value: outputTokenAmount,
            };
          } else {
            // erc20 transfer
            const contract = new ethers.Contract(inputToken.address, erc20ABI, signer);
            request = {
              to: inputToken.address,
              value: Zero,
              data: contract.interface.encodeFunctionData("transfer", [receipientAddress, outputTokenAmount]),
            };
          }
        } else if (SwapType.WRAP_AND_SEND == swapType) {
          const routerContract = new ethers.Contract(V3_SWAP_ROUTER_ADDRESS, RouterABI, signer);
          const multi1 = routerContract.interface.encodeFunctionData("wrapETH", [outputTokenAmount]);
          const multi2 = routerContract.interface.encodeFunctionData("sweepToken", [
            outputTokenAddress,
            outputTokenAmount,
            receipientAddress,
          ]);
          const calls = [multi1, multi2];

          let gas;

          try {
            gas = await routerContract.estimateGas.multicall(calls);
          } catch (error) {
            console.log(error);
            gas = BigNumber.from("400000");
          }
          request = {
            to: V3_SWAP_ROUTER_ADDRESS,
            data: routerContract.interface.encodeFunctionData("multicall", [calls]),
            value: outputTokenAmount,
            gasLimit: gas.add(BigNumber.from("20000")), // 20000 margin
          };
        } else if (SwapType.UNWRAP_AND_SEND == swapType) {
          const routerContract = new ethers.Contract(V3_SWAP_ROUTER_ADDRESS, RouterABI, signer);
          const multi1 = routerContract.interface.encodeFunctionData("pull", [outputToken.address, outputTokenAmount]);
          const multi2 = routerContract.interface.encodeFunctionData("unwrapWETH9", [
            outputTokenAmount,
            receipientAddress,
          ]);
          const calls = [multi1, multi2];

          let gas;

          try {
            gas = await routerContract.estimateGas.multicall(calls);
          } catch (error) {
            console.log(error);
            gas = BigNumber.from("400000");
          }
          request = {
            to: V3_SWAP_ROUTER_ADDRESS,
            data: routerContract.interface.encodeFunctionData("multicall", [calls]),
            gasLimit: gas.add(BigNumber.from("20000")), // 20000 margin
          };
        }
      }

      console.log("IN NATIVE", inputIsNative);
      console.log("OUTPUT NATIVE", outputIsNative);
      console.log("SWAP TYPE", swapType);
      console.log("REQ", request);
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
      swapType: swapType,
    };

    if (SwapType.SWAP != swapType) {
      // Direct send, wrap or unwrap
      ret.quoteAmount = outputTokenAmount;
    } else if (LoadingStatus.SUCCESS == quoteStatus && swapRoute && swapRoute.quote && swapRoute.route) {
      // Swap route
      ret.quoteAmount = BigNumber.from(swapRoute.quote.quotient.toString());
      ret.tokenAddressRoute = swapRoute.route[0].tokenPath.map((uniswapToken) => uniswapToken.address);
      ret.poolAddressRoute = swapRoute.route[0].poolAddresses;
    }

    return ret;
  }, [quoteStatus, swapRoute, quotedGas, inputToken, outputToken, swapType]);

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
