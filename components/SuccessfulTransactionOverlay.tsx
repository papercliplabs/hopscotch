import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepOverlay, { ButtonInfo } from "./FlowStepOverlay";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";

interface SuccessfulTransactionOverlayProps {
    isOpen: boolean;
    subtitle?: string;
    body?: string;
    bodyBold?: string;
    transactionLink?: string;
    primaryButtonInfo?: ButtonInfo;
    bottomText?: string;
}

export default function SuccessfulTransactionOverlay({
    isOpen,
    subtitle,
    body,
    bodyBold,
    transactionLink,
    primaryButtonInfo,
    bottomText,
}: SuccessfulTransactionOverlayProps): ReactElement {
    const secondaryButtonInfo = transactionLink
        ? {
              text: "Receipt",
              onClick: () => openLink(transactionLink, true),
              rightIcon: <Image src={ArrowSquareOutIcon} alt="copy" />,
          }
        : undefined;
    return (
        <FlowStepOverlay
            isOpen={isOpen}
            icon={<Image src={circleCheckImage} alt="check" />}
            subtitle={subtitle}
            body={body}
            bodyBold={bodyBold}
            primaryButtonInfo={primaryButtonInfo}
            secondaryButtonInfo={secondaryButtonInfo}
            bottomText={bottomText}
        />
    );
}
