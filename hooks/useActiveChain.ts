import { useEffect, useMemo, useState } from "react";
import { useNetwork } from "wagmi";

import { SUPPORTED_CHAINS } from "@/common/constants";
import { useRainbowKitChainsById, Chain } from "@papercliplabs/rainbowkit";

export interface UseActiveChain extends Chain {
  connected: boolean,
  iconUrlSync: string,
}

export function useActiveChain(): UseActiveChain {
  const [iconUrlSync, setIconUrlSync] = useState("");
  const { chain: connectedChain } = useNetwork();
  const rainbowkitChainsById = useRainbowKitChainsById();
  const activeChainId = connectedChain?.id ?? SUPPORTED_CHAINS[0].id;
  const rainbowKitChain = rainbowkitChainsById[activeChainId];

  // iconUrl is a promise so we must resolve it
  useEffect(() => {
    const iconUrl = rainbowKitChain?.iconUrl;
    // log
    console.log("iconUrl", iconUrl);
    // if iconUrl is a promise, resolve it
    if (iconUrl instanceof Function) {
      iconUrl().then((url: string) => {
        setIconUrlSync(url)
      });
    } else {
      setIconUrlSync(iconUrl);
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
