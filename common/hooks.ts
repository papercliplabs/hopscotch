import { useEffect, useMemo, useState } from "react";
import { useContract, useNetwork, useProvider, useSigner, useToken } from "wagmi";
import { MIN_SUCCESSFUL_TX_CONFIRMATIONS, SUPPORTED_CHAINS, URLS, V3_SWAP_ROUTER_ADDRESS } from "./constants";
import { LoadingStatus, SwapRouteState, Token, TransactionDetails, TransactionState } from "./types";
import { SwapRoute } from "@uniswap/smart-order-router";
import { CurrencyAmount, TradeType, Percent, Fraction, Token as UniswapToken } from "@uniswap/sdk-core";
import { BigNumber, ethers } from "ethers";
import { JSBI } from "@uniswap/sdk";
import { add, chain } from "lodash";
import { Router } from "next/router";
import { erc20ABI, useSendTransaction } from "wagmi";
import { TransactionResponse } from "@ethersproject/providers";
import { AddressZero, MaxUint256 } from "@ethersproject/constants";
import { TransactionDescription } from "ethers/lib/utils";
import { transformStoryIndexToStoriesHash } from "@storybook/api/dist/ts3.9/lib/stories";
import { AlphaRouter } from "@uniswap/smart-order-router";
import RouterABI from "@/abis/V3UniRouter.json";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

/**
 * Get list of all supported tokens for the active chain
 * @returns list of all supported tokens for chainId
 */
export function useTokenList(): Token[] {
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const { chain: activeChain } = useNetwork();
  const chainId = activeChain?.id ?? SUPPORTED_CHAINS[0].id;

  useEffect(() => {
    async function checkForData() {
      // Fetch the data if it hasn't been fetched already
      if (allTokens.length == 0) {
        console.log("FETCH_TOKEN_LIST");
        fetch(URLS.UNISWAP_TOKEN_LIST)
          .then((response) => response.json())
          .then((data) => {
            const tokens = data.tokens;
            const allTokens: Token[] = [];
            for (const token of tokens) {
              allTokens.push(token as Token);
            }

            setAllTokens(allTokens);
          });
      }
    }

    checkForData();
  }, [allTokens, setAllTokens]);

  useEffect(() => {
    const newFilteredTokens = allTokens.filter((token) => token.chainId == chainId);
    setFilteredTokens(newFilteredTokens);
  }, [chainId, allTokens]);

  return filteredTokens;
}

/**
 * Get price of the token in USD
 * @param Token token to get the price of
 *
 * TODO: implement this, should use quote price from swap of exact input Token to USDC for price
 */
export function useTokenPriceUsd(token: Token | undefined): number | undefined {
  // TODO: implement this
  return 1;
}

export function useChainId(): number {
  const { chain: activeChain } = useNetwork();

  return useMemo(() => {
    return activeChain?.id ?? SUPPORTED_CHAINS[0].id;
  }, [activeChain, SUPPORTED_CHAINS]);
}

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

/**
 * Hook to get the allowance of the swap router for the erc20 token for the user, and provieds a callback to set approval
 * @param tokenAddress erc20 address
 * @param minimumApprovalAmount minimum amount that needs to be approved, if this is not met, calling approve will approve at least this amount
 * @returns
 *    allowance: allowance of the swap router for the erc20 token at tokenAddress
 *    approve: callback to set the approval amount to at least the minimumApprovalAmount
 *    transactionDetails: details about the status of the transaction from approve
 */
export function useApproveErc20ForSwap(
  tokenAddress?: string,
  minimumApprovalAmount?: BigNumber
): {
  requiresApproval?: Boolean;
  approve: () => Promise<string>;
  transactionDetails?: TransactionDetails;
} {
  const [allowance, setAllowance] = useState<BigNumber | undefined>(undefined);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | undefined>(undefined);
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();

  const tokenAddressForContract = useMemo(() => {
    return tokenAddress ?? AddressZero;
  }, [tokenAddress]);

  const contract = useContract({
    addressOrName: tokenAddressForContract,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });

  const requiresApproval = useMemo(() => {
    if (minimumApprovalAmount && allowance) {
      return allowance.lt(minimumApprovalAmount);
    } else {
      return undefined;
    }
  }, [allowance, minimumApprovalAmount]);

  useEffect(() => {
    async function getAllowance() {
      if (signer && contract && AddressZero != tokenAddressForContract) {
        const allowance = await contract.allowance(signer.getAddress(), V3_SWAP_ROUTER_ADDRESS);
        setAllowance(allowance);
      }
    }

    getAllowance();
  }, [tokenAddress, minimumApprovalAmount, signer, contract, setAllowance, transactionDetails?.state]);

  async function approve(): Promise<string> {
    let txHash = "INVALID_PARAM";
    if (contract && allowance && requiresApproval) {
      const txResponse = await contract.approve(V3_SWAP_ROUTER_ADDRESS, MaxUint256);
      txHash = txResponse.hash;
      setTransactionDetails({ state: TransactionState.PENDING, response: txResponse, receipt: undefined });
      addRecentTransaction({ hash: txHash, description: "Approve", confirmations: MIN_SUCCESSFUL_TX_CONFIRMATIONS });

      // Wait for tx to finish
      const txReceipt = await txResponse.wait(MIN_SUCCESSFUL_TX_CONFIRMATIONS);
      const txStatus = txReceipt.status == 1 ? TransactionState.SUCCESS : TransactionState.FAILED;
      setTransactionDetails({ state: txStatus, response: txResponse, receipt: txReceipt });
    } else {
      setTransactionDetails(undefined);
    }
    return txHash;
  }

  return { requiresApproval, approve, transactionDetails };
}

/**
 * Hook to get quote for exact output swap, and provides a callback to execute the quoted swap.
 * @param inputTokenAddress input token in the swap (from token)
 * @param outputTokenAddress output token in the swap (to token)
 * @param outputTokenAmount amount of output token required for the swap
 * @param receipientAddress address to send the output token to
 * @returns
 *    swapRouteState: state of the swap route quote
 *    swapRoute: swap route being quoted
 *    executeSwap: execute the swap for the current swapRoute quote
 *    transactionDetails: details about the status of the transaction from executeSwap
 */
export function useExactOutputSwap(
  inputTokenAddress?: string,
  outputTokenAddress?: string,
  outputTokenAmount?: BigNumber,
  receipientAddress?: string
): {
  swapRouteState: SwapRouteState;
  swapRoute?: SwapRoute;
  executeSwap: () => Promise<string>;
  transactionDetails?: TransactionDetails;
} {
  const [swapRoute, setSwapRoute] = useState<SwapRoute | undefined>(undefined);
  const [swapRouteState, setSwapRouteState] = useState<SwapRouteState>(SwapRouteState.INVALID);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | undefined>(undefined);

  const chainId = useChainId();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const routerContract = useContract({
    addressOrName: V3_SWAP_ROUTER_ADDRESS,
    contractInterface: RouterABI,
    signerOrProvider: signer,
  });
  const inputToken = useUniswapToken(inputTokenAddress, chainId);
  const outputToken = useUniswapToken(outputTokenAddress, chainId);
  const addRecentTransaction = useAddRecentTransaction();

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

        console.log(route);

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

  // Execute the current swapRoute, and return the transaction hash
  async function executeSwap(): Promise<string> {
    let txHash = "INVALID_PARAM";
    if (swapRoute && swapRoute.methodParameters && signer) {
      const address = await signer.getAddress();

      const calls = [];

      // Call to do the multi
      calls.push(swapRoute.methodParameters.calldata);

      // TODO: handle to and from ETH + fee, etc (see demo)
      const multi0 = routerContract.interface.encodeFunctionData("multicall", [calls]);

      const gas = await routerContract.estimateGas.multicall(calls, {
        from: address,
        value: swapRoute.methodParameters.value, // TODO
      });

      const transaction = {
        to: V3_SWAP_ROUTER_ADDRESS,
        from: address,
        value: BigNumber.from(swapRoute.methodParameters.value),
        gasLimit: gas.add(BigNumber.from("20000")), // Small margin ontop of gas estimate
        data: multi0,
      };

      const txResponse = await signer.sendTransaction(transaction);
      txHash = txResponse.hash;
      setTransactionDetails({ state: TransactionState.PENDING, response: txResponse, receipt: undefined });
      addRecentTransaction({
        hash: txHash,
        description: "Pay request",
        confirmations: MIN_SUCCESSFUL_TX_CONFIRMATIONS,
      });

      // Wait for tx to finish
      const txReceipt = await txResponse.wait(MIN_SUCCESSFUL_TX_CONFIRMATIONS);
      const txStatus = txReceipt.status == 1 ? TransactionState.SUCCESS : TransactionState.FAILED;
      setTransactionDetails({ state: txStatus, response: txResponse, receipt: txReceipt });
    } else {
      setTransactionDetails(undefined);
    }
    return txHash;
  }

  return { swapRouteState, swapRoute, executeSwap, transactionDetails };
}

/**
 * Get a token from an address
 * @param address address of token to get
 */
export function useTokenFromAddress(address: string | undefined, chainId: number | undefined): Token | undefined {
  // TODO: make this not shitty
  const wagmiToken = useToken({ address: address, chainId: chainId });

  if (!address || !chainId || !wagmiToken || !wagmiToken.data) {
    return undefined;
  }

  const token: Token = {
    chainId: chainId,
    address: wagmiToken.data!.address,
    name: wagmiToken.data!.symbol,
    symbol: wagmiToken.data!.symbol,
    decimals: wagmiToken.data!.decimals,
    logoURI: "",
  };

  return token;
}
