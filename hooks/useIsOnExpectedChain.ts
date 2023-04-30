import { useAccount } from "wagmi";
import { useChain } from "./useChain";

export function useIsOnExpectedChain(expectedChainId: number | undefined): boolean {
    const { id: chainId, connected } = useChain();
    const { address } = useAccount();
    return (chainId == expectedChainId && connected) || address == undefined;
}
