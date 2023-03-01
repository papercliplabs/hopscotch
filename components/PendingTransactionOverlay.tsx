import { openLink } from "@/common/utils";
import { colors } from "@/theme/colors";
import { Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";
import FlowStepOverlay from "./FlowStepOverlay";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";

interface PendingTransactionOverlayProps {
    isOpen: boolean;
    title?: string;
    transactionLink?: string;
}

export default function PendingTransactionOverlay({
    isOpen,
    title,
    transactionLink,
}: PendingTransactionOverlayProps): ReactElement {
    return (
        <FlowStepOverlay
            isOpen={isOpen}
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
