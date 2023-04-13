import { openLink } from "@/common/utils";
import { colors } from "@/theme/colors";
import { Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";
import FlowStepView from "../layouts/FlowStepView";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";

interface PendingTransactionViewProps {
    title?: string;
    transactionLink?: string;
}

export default function PendingTransactionView({ title, transactionLink }: PendingTransactionViewProps): ReactElement {
    return (
        <FlowStepView
            title={title}
            icon={
                <Spinner
                    thickness="8px"
                    speed="1.0s"
                    emptyColor="bgPrimary"
                    color="textInteractive"
                    boxSize="60px"
                    style={{
                        borderTopColor: colors.bgPrimary,
                    }}
                />
            }
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
