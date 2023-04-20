import { openLink } from "@/common/utils";
import { ReactElement } from "react";
import FlowStepView from "@/layouts/FlowStepView";
import circleFailImage from "@/public/static/CircleFail.svg";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";

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
                rightIcon: <Image src={ArrowSquareOutIcon} alt="copy" />,
            }}
        />
    );
}
