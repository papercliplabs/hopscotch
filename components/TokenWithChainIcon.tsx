import { Token } from "@/common/types";
import { UseChain } from "@/hooks/useChain";
import { Avatar, AvatarBadge, Img } from "@chakra-ui/react";

interface TokenWithChainIconProps {
    token?: Token;
    chain?: UseChain;
    size: number;
}

export default function TokenWithChainIcon({ token, chain, size }: TokenWithChainIconProps) {
    return (
        <Avatar height={`${size}px`} width={`${size}px`} mr={4} src={token?.logoURI}>
            <AvatarBadge borderWidth={2}>
                <Img src={chain?.iconUrlSync || ""} alt={chain?.name ?? ""} boxSize={`${size * 0.4}px`} />
            </AvatarBadge>
        </Avatar>
    );
}
