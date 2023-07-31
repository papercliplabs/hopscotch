import { useRef } from "react";
import { Token } from "@/common/types";
import { Chain } from "@/hooks/useChain";
import useIsOnScreen from "@/hooks/useIsOnScreen";
import { Avatar, AvatarBadge, Img } from "@chakra-ui/react";

interface TokenWithChainIconProps {
    token?: Token;
    chain?: Chain;
    size: number;
    mr?: number;
}

export default function TokenWithChainIcon({ token, chain, size, mr }: TokenWithChainIconProps) {
    const ref = useRef<HTMLInputElement>(null);
    const isVisible = useIsOnScreen(ref);

    return (
        <Avatar
            ref={ref}
            height={`${size}px`}
            width={`${size}px`}
            mr={mr}
            src={isVisible ? token?.logoURI : undefined}
            boxShadow="defaultSm"
        >
            <AvatarBadge borderWidth={2} backgroundColor="white">
                <Img src={isVisible ? chain?.iconUri || "" : undefined} alt={""} boxSize={`${size * 0.5}px`} />
            </AvatarBadge>
        </Avatar>
    );
}
