import { useNetwork, Chain as WagmiChain } from "wagmi";

import { SUPPORTED_CHAINS } from "@/common/constants";
import { getChainLogoUri } from "@/common/utils";

export interface Chain extends WagmiChain {
    iconUri: string;
    unsupported: boolean;
    connected: boolean;
}

/**
 * Get the chain for the chainId, or the active chain is no chainId is passed
 * @param chainId chain id to get the chain for if a specific chain is desired
 * @returns chain for chainId, or the active chain if chainId is undefined
 */
export function useChain(chainId: number | undefined = undefined): Chain {
    const { chain: connectedChain, chains } = useNetwork();
    const chainIdInternal = chainId ?? connectedChain?.id;
    const chain = SUPPORTED_CHAINS.filter((chain) => chain.id == chainIdInternal)[0] ?? SUPPORTED_CHAINS[0];

    return {
        ...chain,
        connected: chain?.id == connectedChain?.id,
        unsupported: connectedChain?.unsupported ?? false,
        iconUri: getChainLogoUri(chain?.id) ?? "",
    };
}
