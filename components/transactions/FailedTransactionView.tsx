import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepView from "@/layouts/FlowStepView";
import { ArrowSquareOut, WarningCircle } from "@phosphor-icons/react";
import { colors } from "@/theme/colors";

interface FailedTransactionViewProps {
    subtitle?: string;
    transactionLink?: string;
    actionButtonText: string;
    actionButtonCallback: () => void;
}

export default function FailedTransactionView({
    subtitle,
    transactionLink,
    actionButtonText,
    actionButtonCallback,
}: FailedTransactionViewProps): ReactElement {
    return (
        <FlowStepView
            icon={<WarningCircle size={70} weight="fill" color={colors.critical} />}
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
                rightIcon: <ArrowSquareOut size={24} weight="bold" />,
            }}
        />
    );
}
