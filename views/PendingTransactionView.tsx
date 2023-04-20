import { openLink } from "@/common/utils";
import { colors } from "@/theme/colors";
import { ReactElement } from "react";
import FlowStepView from "@/layouts/FlowStepView";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";
import Spinner from "@/components/Spinner";

interface PendingTransactionViewProps {
    title?: string;
    transactionLink?: string;
}

export default function PendingTransactionView({ title, transactionLink }: PendingTransactionViewProps): ReactElement {
    return (
        <FlowStepView
            title={title}
            icon={<Spinner size="80px" />}
            subtitle="Transaction submitted"
            body="Please wait..."
            secondaryButtonInfo={{
                text: "View Transaction",
                onClick: () => openLink(transactionLink, true),
                rightIcon: <Image src={ArrowSquareOutIcon} alt="copy" />,
            }}
        />
    );
}
