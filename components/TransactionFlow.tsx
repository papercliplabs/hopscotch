import { ReactElement } from "react";
import { Transaction } from "@papercliplabs/rainbowkit";
import PendingTransactionView from "@/views/PendingTransactionView";
import PendingSignatureView from "@/views/PendingSignatureView";
import { Fade } from "@chakra-ui/react";
import FailedTransactionView from "@/views/FailedTransactionView";

import Carousel from "./Carousel";

interface TransactionFlowProps {
    title?: string;
    pendingWalletSignature: boolean;
    transaction?: Transaction;
    transactionExplorerLink?: string;
    successfulTransactionView?: ReactElement;
    abortSignatureCallback?: () => void;
    retryFailedTransactionCallback: () => void;
}

export default function TransactionFlow({
    title,
    pendingWalletSignature,
    transaction,
    transactionExplorerLink,
    successfulTransactionView,
    abortSignatureCallback,
    retryFailedTransactionCallback,
}: TransactionFlowProps) {
    return (
        <Carousel
            views={[
                <>
                    <PendingSignatureView title={title} abortSignatureCallback={abortSignatureCallback} />

                    <Fade
                        in={!pendingWalletSignature && transaction != undefined}
                        unmountOnExit={true}
                        style={{ padding: "inherit" }}
                    >
                        <PendingTransactionView title={title} transactionLink={transactionExplorerLink} />
                    </Fade>
                </>,
                <>
                    <Fade
                        in={transaction?.status == "confirmed" && successfulTransactionView != undefined}
                        unmountOnExit={true}
                        style={{ padding: "inherit" }}
                    >
                        {successfulTransactionView}
                    </Fade>
                    <Fade in={transaction?.status == "failed"} unmountOnExit={true} style={{ padding: "inherit" }}>
                        <FailedTransactionView
                            subtitle={title + " failed!"}
                            transactionLink={transactionExplorerLink}
                            actionButtonText="Try again"
                            actionButtonCallback={() => retryFailedTransactionCallback()}
                        />
                    </Fade>
                </>,
            ]}
            activeViewIndex={
                (transaction?.status == "confirmed" && successfulTransactionView) || transaction?.status == "failed"
                    ? 1
                    : 0
            }
        />
    );
}
