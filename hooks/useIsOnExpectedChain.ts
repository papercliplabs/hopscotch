import { useChainId } from "./useChainId";

export function useIsOnExpectedChain(expectedChainId: number | undefined): boolean {
  const chainId = useChainId();
  return chainId == expectedChainId;
}
