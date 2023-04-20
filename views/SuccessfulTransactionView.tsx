import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepView, { ButtonInfo } from "@/layouts/FlowStepView";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";

interface SuccessfulTransactionViewProps {
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
        <FlowStepView
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
