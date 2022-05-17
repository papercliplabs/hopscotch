import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { SUPPORTED_CHAINS, URLS } from "./constants";
import { Token } from "./types";

/**
 * Get list of all supported tokens for the active chain
 * @returns list of all supported tokens for chainId
 */
export function useTokenList(): Token[] {
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const { activeChain } = useNetwork();
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
