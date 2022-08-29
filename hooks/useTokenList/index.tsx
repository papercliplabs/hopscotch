import { useMemo } from "react";

import { Token } from "@/common/types";
import { useTokenListContext } from "./provider";
import { useChainId } from "../useChainId";

/**
 * Get list of all supported tokens for the active chain
 * @param chainIdOverride chain id to explicitly use, if not passed active chain id will be used
 * @returns list of all supported tokens for chainId
 */
export function useTokenList(chainIdOverride?: number): Token[] {
  const { tokens } = useTokenListContext();
  const activeChainId = useChainId();

  const chainId = useMemo(() => {
    return chainIdOverride ?? activeChainId;
  }, [activeChainId, chainIdOverride]);

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => token.chainId == chainId);
  }, [tokens, chainId]);

  return filteredTokens;
}

/**
 * Get the token at the address, it must be part of the whitelist to obtain
 * @param address address of token to get
 * @param chainIdOverride chain id to explicitly use, if not passed active chain id will be used
 * @return token at address, or undefined if it is not part of whitelist
 */
export function useToken(address?: string, chainIdOverride?: number): Token | undefined {
  const tokens = useTokenList(chainIdOverride);

  return useMemo(() => {
    return address ? tokens.find((token) => token.address == address) : undefined;
  }, [tokens, address]);
}
