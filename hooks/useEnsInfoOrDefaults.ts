import { useEffect, useState } from "react";
import { Address } from "wagmi";

import { fetchEnsInfo, EnsInfo, shortAddress, getDefaultLinearGradientForAddress } from "@/common/utils";
import { Length } from "@/common/types";

export function useEnsInfoOrDefaults(address?: Address): EnsInfo {
    const [name, setName] = useState<string | undefined>(undefined);
    const [backgroundImg, setBackgroundImg] = useState<string | undefined>(undefined);
    const [lastAddress, setLastAddress] = useState<Address | undefined>(undefined);

    useEffect(() => {
        async function fetch() {
            if (address != lastAddress) {
                // Set to defaults
                setName(shortAddress(address?.toLowerCase(), Length.MEDIUM));
                setBackgroundImg(getDefaultLinearGradientForAddress(address));

                // Update with ens if they exist
                const { name: ensName, backgroundImg: ensBackgroundImg } = await fetchEnsInfo(address);
                if (ensName) {
                    setName(ensName);
                }

                if (ensBackgroundImg) {
                    setBackgroundImg(ensBackgroundImg);
                }

                setLastAddress(address);
            }
        }
        fetch();
    }, [address, lastAddress, setLastAddress]);

    return { name, backgroundImg };
}
