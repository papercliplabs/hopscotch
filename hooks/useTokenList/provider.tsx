import { useContext, createContext, ReactNode, useEffect, useState, useMemo } from "react";

import { BaseToken, Token } from "@/common/types";
import { erc20ABI, useAccount, useContractReads } from "wagmi";
import { COIN_GECKO_API_PLATFORM_ID, SUPPORTED_CHAINS, URLS } from "@/common/constants";
import { BigNumber, ethers } from "ethers";

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

  const { address } = useAccount();

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
            setBaseTokens(data.tokens as Array<BaseToken>);
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

          if (coinGeckoPlatformId) {
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
    return baseTokens.map((token) => {
      return {
        addressOrName: token.address,
        contractInterface: erc20ABI,
        functionName: "balanceOf",
        args: [address],
        chainId: token.chainId,
      };
    });
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
  // Construct tokens
  ////
  useEffect(() => {
    let ret: Token[] = [];

    for (let i = 0; i < baseTokens.length; i++) {
      const baseToken = baseTokens[i];
      const price = prices ? prices[i] : undefined;
      const balance = balances ? balances[i] : undefined;
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
  }, [baseTokens, balances, prices]);

  return <TokenListContext.Provider value={{ tokens }}>{children}</TokenListContext.Provider>;
}
