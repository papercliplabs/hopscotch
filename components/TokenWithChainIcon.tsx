import { Token } from "@/common/types";
import { UseChain } from "@/hooks/useChain";
import { Avatar, AvatarBadge, Img } from "@chakra-ui/react";

interface TokenWithChainIconProps {
    token?: Token;
    chain?: UseChain;
    size: number;
    mr?: number;
}

const convertIpfsUrl = (url: string | undefined) => {
    return (url || "").replace("ipfs://", "https://ipfs.io/ipfs/");
};

export default function TokenWithChainIcon({ token, chain, size, mr }: TokenWithChainIconProps) {
    return (
        <Avatar
            height={`${size}px`}
            width={`${size}px`}
            mr={mr}
            src={convertIpfsUrl(token?.logoURI)}
            style={{
                filter: "drop-shadow(0px 20px 8px rgba(0, 0, 0, 0.01)) drop-shadow(0px 11px 7px rgba(0, 0, 0, 0.03)) drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.04)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.05)) drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.05))",
            }}
        >
            <AvatarBadge borderWidth={2}>
                <Img src={chain?.iconUrlSync || ""} alt={chain?.name ?? ""} boxSize={`${size * 0.4}px`} />
            </AvatarBadge>
        </Avatar>
    );
}
