import { useEffect, useState } from "react";
import { Address } from "wagmi";

import { shortAddress } from "@/common/utils";
import { Length } from "@/common/types";
import { jsNumberForAddress } from "react-jazzicon";

export interface EnsInfo {
    name?: string;
    backgroundImg?: string;
}

export function getDefaultLinearGradientForAddress(address?: Address) {
    const number = Math.ceil(jsNumberForAddress(address ?? "") % 0xffffff);
    return `linear-gradient(45deg, #${number.toString(16).padStart(6, "0")}, #FFFFFF)`;
}

export async function fetchEnsInfo(address?: Address): Promise<EnsInfo> {
    // Removing manual ENS for now, since even with, not sync with rainbow kit
    // const provider = new ethers.providers.AlchemyProvider("mainnet", process.env.NEXT_PUBLIC_ALCHEMY_ID);
    // const name = await provider.lookupAddress(address ?? AddressZero);
    // const image = await provider.getAvatar(name ?? "");

    const name = undefined; //await fetchEnsName({ address: address ?? AddressZero, chainId: 1 });
    const image = undefined; // await fetchEnsAvatar({ address: address ?? AddressZero, chainId: 1 });

    return { name: name ?? undefined, backgroundImg: image ? `url(${image})` : undefined };
}

export function useEnsInfoOrDefaults(address?: Address): EnsInfo {
    const [name, setName] = useState<string | undefined>(undefined);
    const [backgroundImg, setBackgroundImg] = useState<string | undefined>(undefined);
    const [lastAddress, setLastAddress] = useState<Address | undefined>(undefined);

    useEffect(() => {
        async function fetch() {
            if (address != lastAddress) {
                // Set to defaults
                setName(shortAddress(address, Length.MEDIUM));
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
