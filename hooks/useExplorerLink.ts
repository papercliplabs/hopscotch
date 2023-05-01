import { useChain } from "@/hooks/useChain";
import { Chain } from "wagmi";

export enum ExplorerLinkType {
    TOKEN = "token",
    WALLET_OR_CONTRACT = "address",
    TRANSACTION = "tx",
}

export function getExplorerLink(
    hashOrAddress: string | undefined,
    linkType: ExplorerLinkType,
    chain: Chain | undefined
): string | undefined {
    const baseLink = chain?.blockExplorers?.default.url;

    if (baseLink && hashOrAddress) {
        return baseLink + "/" + linkType + "/" + hashOrAddress;
    } else {
        return undefined;
    }
}

/**
 * Helper to get an explorer link for a hash or address
 * @param hashOrAddress hash or address to generatee th link for
 * @param linkType type of link this hash or address corresponds to
 * @param customChain custom chain instead of the connected one
 * @return explorer link
 */
export function useExplorerLink(
    hashOrAddress: string | undefined,
    linkType: ExplorerLinkType,
    customChain: Chain | undefined
): string | undefined {
    const activeChain = useChain();
    return getExplorerLink(hashOrAddress, linkType, customChain ?? activeChain);
}
