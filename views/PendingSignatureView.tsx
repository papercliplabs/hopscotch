import { colors } from "@/theme/colors";
import { Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";
import FlowStepView from "../layouts/FlowStepView";

interface PendingSignatureViewProps {
    title?: string;
    abortSignatureCallback?: () => void;
}

export default function PendingSignatureView({
    title,
    abortSignatureCallback,
}: PendingSignatureViewProps): ReactElement {
    return (
        <FlowStepView
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
        />
    );
}
