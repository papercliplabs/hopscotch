import { Token } from "@/common/types";
import { UseChain } from "@/hooks/useChain";
import { colors } from "@/theme/colors";
import { Avatar, AvatarBadge, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { ReactElement } from "react";
import FlowStepOverlay from "./FlowStepOverlay";

interface ApproveTokenOverlayProps {
    isOpen: boolean;
    token?: Token;
    chain?: UseChain;
    approveCallback?: () => void;
    backButtonCallback?: () => void;
}

export default function ApproveTokenOverlay({
    isOpen,
    token,
    chain,
    approveCallback,
    backButtonCallback,
}: ApproveTokenOverlayProps): ReactElement {
    return (
        <FlowStepOverlay
            isOpen={isOpen}
            title={`Approve ${token?.symbol}`}
            backButtonCallback={backButtonCallback}
            icon={
                <Avatar height="60px" width="60px" mr={4} src={token?.logoURI}>
                    <AvatarBadge borderWidth={2}>
                        <Image
                            src={chain?.iconUrlSync ?? ""}
                            alt={chain?.name}
                            width="26px"
                            height="26px"
                            layout="fixed"
                            objectFit="contain"
                            className="rounded-full"
                        />
                    </AvatarBadge>
                </Avatar>
            }
            subtitle={`Before you pay with ${token?.symbol}, you need to approve it first.`}
            body={`You only need to approve ${token?.symbol} once.`}
            primaryButtonInfo={{
                text: `Approve my ${token?.symbol}`,
                onClick: approveCallback,
            }}
        />
    );
}
