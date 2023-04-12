import { ExplorerLinkType } from "@/common/types";
import { getExplorerLink } from "@/common/utils";
import { useChain } from "@/hooks/useChain";
import { Chain } from "wagmi";

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
