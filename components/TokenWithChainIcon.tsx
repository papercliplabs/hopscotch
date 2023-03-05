import { Token } from "@/common/types";
import { UseChain } from "@/hooks/useChain";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import Image from "next/image";

interface TokenWithChainIconProps {
    token?: Token;
    chain?: UseChain;
    size: number;
}

export default function TokenWithChainIcon({ token, chain, size }: TokenWithChainIconProps) {
    return (
        <Avatar height={`${size}px`} width={`${size}px`} mr={4} src={token?.logoURI}>
            <AvatarBadge borderWidth={2}>
                <Image
                    src={chain?.iconUrlSync || ""}
                    alt={chain?.name}
                    width={size * 0.4}
                    height={size * 0.4}
                    className="rounded-full"
                />
            </AvatarBadge>
        </Avatar>
    );
}
