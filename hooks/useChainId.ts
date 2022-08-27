import { useMemo } from "react";
import { useNetwork } from "wagmi";

import { SUPPORTED_CHAINS } from "@/common/constants";

export function useChainId(): number {
  const { chain: activeChain } = useNetwork();

  return useMemo(() => {
    return activeChain?.id ?? SUPPORTED_CHAINS[0].id;
  }, [activeChain, SUPPORTED_CHAINS]);
}
