import { useRef } from "react";
import { Token } from "@/common/types";
import { UseChain } from "@/hooks/useChain";
import useIsOnScreen from "@/hooks/useIsOnScreen";
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
    const ref = useRef<HTMLInputElement>(null);
    const isVisible = useIsOnScreen(ref);

    console.log("IS VIS", token?.name, isVisible);

    return (
        <Avatar
            ref={ref}
            height={`${size}px`}
            width={`${size}px`}
            mr={mr}
            src={isVisible ? convertIpfsUrl(token?.logoURI) : undefined}
            style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 2px 3px 2px",
            }}
        >
            <AvatarBadge borderWidth={2}>
                <Img src={isVisible ? chain?.iconUrlSync || "" : undefined} alt={""} boxSize={`${size * 0.4}px`} />
            </AvatarBadge>
        </Avatar>
    );
}
