import { useEffect, useMemo, useState } from "react";
import { useNetwork } from "wagmi";

import { SUPPORTED_CHAINS } from "@/common/constants";
import { Chain } from "@/common/types";
import { useRainbowKitChainsById } from "@papercliplabs/rainbowkit";

export interface UseChain extends Chain {
  connected: boolean;
  iconUrlSync: string;
}

/**
 * Get the chain for the chainId, or the active chain is no chainId is passed
 * @param customChainId custom chain id to get the chain for
 * @returns chain for customChainId or the active chain if customChainId is undefined
 */
export function useChain(customChainId: number | undefined = undefined): UseChain {
  const [iconUrlSync, setIconUrlSync] = useState("");
  const { chain: connectedChain } = useNetwork();
  const rainbowkitChainsById = useRainbowKitChainsById();
  const chainId = customChainId ?? connectedChain?.id ?? SUPPORTED_CHAINS[0].id;
  const rainbowKitChain = rainbowkitChainsById[chainId] as Chain;

  // iconUrl is a promise so we must resolve it
  useEffect(() => {
    const iconUrl = rainbowKitChain?.iconUrl;
    // if iconUrl is a promise, resolve it
    if (iconUrl instanceof Function) {
      iconUrl().then((url: string) => {
        setIconUrlSync(url);
      });
    } else {
      setIconUrlSync(iconUrl ?? "");
    }
  }, [rainbowKitChain]);

  return useMemo(() => {
    return {
      ...rainbowKitChain,
      connected: !!connectedChain,
      iconUrlSync,
    };
  }, [rainbowKitChain, connectedChain, iconUrlSync]);
}