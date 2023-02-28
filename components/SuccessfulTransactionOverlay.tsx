import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepOverlay from "./FlowStepOverlay";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import Image from "next/image";

interface SuccessfulTransactionOverlayProps {
    isOpen: boolean;
    subtitle?: string;
    body?: string;
    bodyBold?: string;
    transactionLink?: string;
    bottomText?: string;
}

export default function SuccessfulTransactionOverlay({
    isOpen,
    subtitle,
    body,
    bodyBold,
    transactionLink,
    bottomText,
}: SuccessfulTransactionOverlayProps): ReactElement {
    return (
        <FlowStepOverlay
            isOpen={isOpen}
            icon={<Image src={circleCheckImage} alt="check" />}
            subtitle={subtitle}
            body={body}
            bodyBold={bodyBold}
            secondaryButtonInfo={{
                text: "Receipt",
                onClick: () => openLink(transactionLink, true),
            }}
            bottomText={bottomText}
        />
    );
}
