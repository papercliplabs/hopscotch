import { Token } from "@/common/types";
import { UseChain } from "@/hooks/useChain";
import { colors } from "@/theme/colors";
import { Avatar, AvatarBadge, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { ReactElement } from "react";
import FlowStepView from "@/layouts/FlowStepView";

interface ApproveTokenViewProps {
    token?: Token;
    chain?: UseChain;
    approveCallback?: () => void;
    backButtonCallback?: () => void;
}

export default function ApproveTokenView({
    token,
    chain,
    approveCallback,
    backButtonCallback,
}: ApproveTokenViewProps): ReactElement {
    return (
        <FlowStepView
            title={`Approve ${token?.symbol}`}
            backButtonCallback={backButtonCallback}
            icon={
                <Avatar height="60px" width="60px" mr={4} src={token?.logoURI}>
                    <AvatarBadge borderWidth={2}>
                        <Image
                            src={chain?.iconUrlSync ?? ""}
                            alt={chain?.name ?? ""}
                            width={26}
                            height={26}
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
