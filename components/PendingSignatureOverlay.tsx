import { colors } from "@/theme/colors";
import { Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";
import FlowStepOverlay from "./FlowStepOverlay";

interface PendingSignatureOverlayProps {
    isOpen: boolean;
    title?: string;
    abortSignatureCallback?: () => void;
}

export default function PendingSignatureOverlay({
    isOpen,
    title,
    abortSignatureCallback,
}: PendingSignatureOverlayProps): ReactElement {
    return (
        <FlowStepOverlay
            isOpen={isOpen}
            title={title}
            backButtonCallback={abortSignatureCallback}
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
            subtitle="Waiting for signature"
            body="Confirm transaction in your wallet."
            primaryButtonInfo={{
                text: "Confirm in wallet",
            }}
        />
    );
}
