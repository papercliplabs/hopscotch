import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepOverlay from "./FlowStepOverlay";
import circleFailImage from "@/public/static/CircleFail.svg";
import Image from "next/image";

interface FailedTransactionOverlayProps {
    isOpen: boolean;
    subtitle?: string;
    transactionLink?: string;
    actionButtonText: string;
    actionButtonCallback: () => void;
}

export default function FailedTransactionOverlay({
    isOpen,
    subtitle,
    transactionLink,
    actionButtonText,
    actionButtonCallback,
}: FailedTransactionOverlayProps): ReactElement {
    return (
        <FlowStepOverlay
            isOpen={isOpen}
            icon={<Image src={circleFailImage} alt="check" />}
            subtitle={subtitle}
            body="An error occurred, please try again."
            primaryButtonInfo={{
                text: actionButtonText,
                onClick: () => {
                    actionButtonCallback();
                },
            }}
            secondaryButtonInfo={{
                text: "View transaction",
                onClick: () => openLink(transactionLink, true),
            }}
        />
    );
}
