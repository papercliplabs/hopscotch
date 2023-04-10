import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepOverlay, { ButtonInfo } from "../layouts/FlowStepOverlay";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";

interface SuccessfulTransactionViewProps {
    isOpen: boolean;
    subtitle?: string;
    body?: string;
    bodyBold?: string;
    transactionLink?: string;
    custom?: ReactElement;
    primaryButtonInfo?: ButtonInfo;
    bottomText?: string;
    compressButtons?: boolean;
}

export default function SuccessfulTransactionView({
    isOpen,
    subtitle,
    body,
    bodyBold,
    transactionLink,
    custom,
    primaryButtonInfo,
    bottomText,
    compressButtons,
}: SuccessfulTransactionViewProps): ReactElement {
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
            compressButtons={compressButtons}
            custom={custom}
        />
    );
}
