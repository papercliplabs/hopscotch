import { useActiveChain } from "./useActiveChain";

export function useIsOnExpectedChain(expectedChainId: number | undefined): boolean {
  const { id: chainId } = useActiveChain();
  return chainId == expectedChainId;
}
