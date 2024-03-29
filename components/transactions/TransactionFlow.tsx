import { ReactElement } from "react";
import PendingTransactionView from "@/components/transactions/PendingTransactionView";
import PendingSignatureView from "@/components/transactions/PendingSignatureView";
import { Fade } from "@chakra-ui/react";
import FailedTransactionView from "@/components/transactions/FailedTransactionView";

import Carousel from "../Carousel";
import { SendTransactionResponse } from "@/hooks/transactions/useSendTransaction";

interface TransactionFlowProps {
    title?: string;
    transactionResponse: SendTransactionResponse;
    successfulTransactionView?: ReactElement;
}

export default function TransactionFlow({
    title,
    transactionResponse,
    successfulTransactionView,
}: TransactionFlowProps) {
    return (
        <Carousel
            views={[
                <>
                    <PendingSignatureView title={title} abortSignatureCallback={transactionResponse.reset} />

                    <Fade
                        in={!transactionResponse.pendingWalletSignature && transactionResponse.hash != undefined}
                        unmountOnExit={true}
                        style={{ padding: "inherit" }}
                    >
                        <PendingTransactionView title={title} transactionLink={transactionResponse.explorerLink} />
                    </Fade>
                </>,
                <>
                    <Fade
                        in={transactionResponse.receipt?.status == "success" && successfulTransactionView != undefined}
                        unmountOnExit={true}
                        style={{ padding: "inherit" }}
                    >
                        {successfulTransactionView}
                    </Fade>
                    <Fade
                        in={transactionResponse.receipt?.status == "reverted"}
                        unmountOnExit={true}
                        style={{ padding: "inherit" }}
                    >
                        <FailedTransactionView
                            subtitle={title + " failed!"}
                            transactionLink={transactionResponse.explorerLink}
                            actionButtonText="Try again"
                            actionButtonCallback={transactionResponse.reset}
                        />
                    </Fade>
                </>,
            ]}
            activeViewIndex={
                (transactionResponse.receipt?.status == "success" && successfulTransactionView) ||
                transactionResponse.receipt?.status == "reverted"
                    ? 1
                    : 0
            }
        />
    );
}
