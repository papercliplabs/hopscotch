import { useChain } from "./useChain";

export function useIsOnExpectedChain(expectedChainId: number | undefined): boolean {
  const { id: chainId } = useChain();
  return chainId == expectedChainId;
}
