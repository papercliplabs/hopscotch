import Spinner from "@/components/Spinner";
import { colors } from "@/theme/colors";
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
            icon={<Spinner size="80px" />}
            subtitle="Check wallet app"
            body="Confirm transaction in your wallet."
            primaryButtonInfo={{
                text: "Confirm in wallet",
            }}
        />
    );
}
