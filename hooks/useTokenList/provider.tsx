import { useContext, createContext, ReactNode, useEffect, useState, useMemo } from "react";

import { BaseToken, Token } from "@/common/types";
import { erc20ABI, useAccount, useContractReads, useProvider, useSigner } from "wagmi";
import { COIN_GECKO_API_PLATFORM_ID, NATIVE_TOKENS, SUPPORTED_CHAINS, URLS } from "@/common/constants";
import { BigNumber, ethers } from "ethers";
import { AddressZero } from "@ethersproject/constants";
import { wagmiClient } from "@/pages/_app";
import { getSupportedChainIds } from "@/common/utils";
import { concat, flow, uniqBy } from "lodash/fp";

type TokenListProviderInterface = {
  tokens: Token[];
};

const TokenListContext = createContext<TokenListProviderInterface>({ tokens: Array<Token>() });

export function useTokenListContext() {
  return useContext(TokenListContext);
}

export default function TokenListProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [baseTokens, setBaseTokens] = useState<BaseToken[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [nativeTokenBalances, setNativeTokenBalances] = useState<BigNumber[]>([]);

  const { address } = useAccount();
  const provider = useProvider();

  ////
  // Fetch base tokens
  ////
  useEffect(() => {
    async function checkForBaseList() {
      // Fetch the data if it hasn't been fetched already
      if (baseTokens.length == 0) {
        console.log("FETCHING_BASE_TOKEN_LIST");
        fetch(URLS.UNISWAP_TOKEN_LIST)
          .then((response) => response.json())
          .then((data) => {
            let tokens = data.tokens as Array<BaseToken>;

            // Filter for only chains we are on
            const supportedChainIds = getSupportedChainIds();
            let supportedTokens = tokens.filter((token) => supportedChainIds.includes(token.chainId));

            setBaseTokens(supportedTokens);
          });
      }
    }

    checkForBaseList();
  }, [baseTokens, setBaseTokens]);

  ////
  // Fetch token Usd prices (best effort)
  ////
  useEffect(() => {
    async function checkForPrices() {
      // Fetch the data if it hasn't been fetched already
      if (baseTokens.length != 0 && prices.length == 0) {
        console.log("FETCHING_TOKEN_PRICES");
        let priceData: number[] = Array.from({ length: baseTokens.length });

        for (let chain of SUPPORTED_CHAINS) {
          let indecies: number[] = [];
          let addresses: string[] = [];
          for (let i = 0; i < baseTokens.length; i++) {
            if (baseTokens[i].chainId == chain.id) {
              indecies.push(i);
              addresses.push(baseTokens[i].address);
            }
          }

          const coinGeckoPlatformId = COIN_GECKO_API_PLATFORM_ID[chain.id];

          if (coinGeckoPlatformId && addresses.length != 0) {
            const contractAddressQueryParams =
              "&contract_addresses=" + addresses.reduce((state, address) => state + "," + address);
            const currencyQuaryParams = "&vs_currencies=usd";
            fetch(
              URLS.COIN_GECKO_API +
                `/simple/token_price/${coinGeckoPlatformId}?` +
                contractAddressQueryParams +
                currencyQuaryParams
            )
              .then((response) => response.json())
              .then((data) => {
                for (let i = 0; i < indecies.length; i++) {
                  priceData[indecies[i]] = data[addresses[i].toLowerCase()]?.usd;
                }
              })
              .catch((error) => {
                console.log("ERROR WITH COINGECKO REQ: ", error);
              });
          }
        }

        setPrices(priceData);
      }
    }

    checkForPrices();
  }, [baseTokens, prices, setPrices]);

  ////
  // Fetch token balances
  ////
  const readBalanceContractData = useMemo(() => {
    if (address != undefined) {
      return baseTokens.map((token) => {
        return {
          addressOrName: token.address,
          contractInterface: erc20ABI,
          functionName: "balanceOf",
          args: [address],
          chainId: token.chainId,
        };
      });
    } else {
      return [];
    }
  }, [baseTokens, address]);

  const { data: balanceResults } = useContractReads({
    contracts: readBalanceContractData,
    enabled: readBalanceContractData.length != 0 && address != undefined,
  });

  const balances = useMemo(() => {
    let ret = undefined;

    if (balanceResults) {
      ret = balanceResults.map((result) => {
        return result as unknown as BigNumber;
      });
    }

    return ret;
  }, [balanceResults]);

  ////
  // Fetch balances of native tokens (a bit ugly)
  ////
  useEffect(() => {
    async function getNativeTokenBalances() {
      if (address && typeof wagmiClient.config.provider === "function" && nativeTokenBalances.length == 0) {
        let nativeBalances: BigNumber[] = [];
        for (const chain of SUPPORTED_CHAINS) {
          const provider = wagmiClient.config.provider({ chainId: chain.id });
          const bal = await provider.getBalance(address);
          nativeBalances.push(bal);
        }
        setNativeTokenBalances(nativeBalances);
      }
    }

    getNativeTokenBalances();
  }, [nativeTokenBalances, setNativeTokenBalances, address, wagmiClient.config.provider]);

  ////
  // Construct tokens
  ////
  useEffect(() => {
    let ret: Token[] = [];

    // Append native tokens and balances
    const baseTokensExtended = flow(
      concat(baseTokens),
      uniqBy("address"),
    )(NATIVE_TOKENS);

    const balancesExtended = balances ? [...balances].concat(nativeTokenBalances) : undefined;

    for (let i = 0; i < baseTokensExtended.length; i++) {
      const baseToken = baseTokensExtended[i];
      const price = prices ? prices[i] : undefined;
      const balance = balancesExtended ? balancesExtended[i] : undefined;
      const balanceUsd =
        balance != undefined && price != undefined
          ? Number(ethers.utils.formatUnits(balance, baseToken.decimals)) * price
          : undefined;

      ret.push({
        ...baseToken,
        priceUsd: price,
        balance: balance,
        balanceUsd: balanceUsd,
      });
    }

    setTokens(ret);
  }, [baseTokens, balances, prices, nativeTokenBalances]);

  return <TokenListContext.Provider value={{ tokens }}>{children}</TokenListContext.Provider>;
}
