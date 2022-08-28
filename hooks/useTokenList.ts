import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";

import { Token } from "@/common/types";
import { SUPPORTED_CHAINS, URLS } from "@/common/constants";

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
