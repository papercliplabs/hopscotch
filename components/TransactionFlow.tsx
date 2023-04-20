import { ReactElement } from "react";
import { Transaction } from "@papercliplabs/rainbowkit";
import PendingTransactionView from "@/views/PendingTransactionView";
import PendingSignatureView from "@/views/PendingSignatureView";
import { Fade } from "@chakra-ui/react";
import FailedTransactionView from "@/views/FailedTransactionView";

import Carousel from "./Carousel";
import { TransactionReceipt } from "@ethersproject/providers";
import { TransactionStatus } from "@/hooks/transactions/useSendTransaction";
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
                        in={
                            transactionResponse.receipt?.status == TransactionStatus.Successful &&
                            successfulTransactionView != undefined
                        }
                        unmountOnExit={true}
                        style={{ padding: "inherit" }}
                    >
                        {successfulTransactionView}
                    </Fade>
                    <Fade
                        in={transactionResponse.receipt?.status == TransactionStatus.Failed}
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
                (transactionResponse.receipt?.status == TransactionStatus.Successful && successfulTransactionView) ||
                transactionResponse.receipt?.status == TransactionStatus.Failed
                    ? 1
                    : 0
            }
        />
    );
}
