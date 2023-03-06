import { useMemo } from "react";

import { Token } from "@/common/types";
import { useTokenListContext } from "./provider";
import { useChain } from "@/hooks/useChain";

/**
 * Get list of all supported tokens for the active chain
 * @param chainIdOverride chain id to explicitly use, if not passed active chain id will be used
 * @returns list of all supported tokens for chainId
 */
export function useTokenList(chainIdOverride?: number): Token[] {
    const { tokens } = useTokenListContext();
    const { id: activeChainId } = useChain();

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
 * @param chainId chain id to explicitly use, if not passed active chain id will be used
 * @return token at address, or undefined if it is not part of whitelist
 */
export function useToken(address?: string, chainId?: number): Token | undefined {
    const tokens = useTokenList(chainId);

    const token = useMemo(() => {
        return address ? tokens.find((token) => token.address.toLowerCase() == address.toLowerCase()) : undefined;
    }, [tokens, address]);

    return token;
}
