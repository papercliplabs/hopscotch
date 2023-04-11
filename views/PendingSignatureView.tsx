import { colors } from "@/theme/colors";
import { Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";
import FlowStepOverlay from "../layouts/FlowStepOverlay";

interface PendingSignatureViewProps {
    isOpen: boolean;
    title?: string;
    abortSignatureCallback?: () => void;
}

export default function PendingSignatureView({
    isOpen,
    title,
    abortSignatureCallback,
}: PendingSignatureViewProps): ReactElement {
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
            subtitle="Check wallet app"
            body="Confirm transaction in your wallet."
            primaryButtonInfo={{
                text: "Confirm in wallet",
            }}
            exitDelaySec={0.5}
        />
    );
}
