import { Token } from "@/common/types";
import { UseChain } from "@/hooks/useChain";
import { Avatar, AvatarBadge, Img } from "@chakra-ui/react";

interface TokenWithChainIconProps {
    token?: Token;
    chain?: UseChain;
    size: number;
    mr?: number;
}

export default function TokenWithChainIcon({ token, chain, size, mr }: TokenWithChainIconProps) {
    return (
        <Avatar height={`${size}px`} width={`${size}px`} mr={mr} src={token?.logoURI}>
            <AvatarBadge borderWidth={2}>
                <Img src={chain?.iconUrlSync || ""} alt={chain?.name ?? ""} boxSize={`${size * 0.4}px`} />
            </AvatarBadge>
        </Avatar>
    );
}
