import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepView, { ButtonInfo } from "@/layouts/FlowStepView";
import { ArrowSquareOut, CheckCircle } from "@phosphor-icons/react";
import { colors } from "@/theme/colors";

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
              rightIcon: <ArrowSquareOut size={24} weight="bold" />,
          }
        : undefined;
    return (
        <FlowStepView
            icon={<CheckCircle size={70} weight="fill" color={colors.success} />}
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
