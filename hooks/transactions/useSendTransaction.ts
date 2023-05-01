import { TransactionRequest, TransactionReceipt } from "@ethersproject/providers";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useCallback, useState } from "react";
import { usePrepareSendTransaction, useSendTransaction as useSendTransactionWagmi, useWaitForTransaction } from "wagmi";
import { useChain } from "@/hooks/useChain";

import { Chain } from "@/hooks/useChain";
import { ExplorerLinkType, getExplorerLink } from "@/hooks/useExplorerLink";

export enum TransactionStatus {
    Failed = 0,
    Successful = 1,
}

export interface SendTransactionResponse {
    pendingWalletSignature: boolean;
    hash?: string;
    chainId?: number;
    explorerLink?: string;
    receipt?: TransactionReceipt;
    send?: () => void;
    reset: () => void;
}

export default function useSendTransaction(
    transactionRequest?: TransactionRequest & { to: string },
    enableEagerFetch?: boolean,
    description?: string
): SendTransactionResponse {
    const [txChain, setTxChain] = useState<Chain | undefined>(undefined); // Latch the chain id the tx was made on

    const activeChain = useChain();
    const addRecentTransaction = useAddRecentTransaction();

    const { config: prepareConfig } = usePrepareSendTransaction({
        request: transactionRequest,
        enabled: enableEagerFetch,
    });

    const {
        data: sendData,
        isLoading,
        sendTransaction,
        reset: txReset,
    } = useSendTransactionWagmi({
        ...prepareConfig,
        onError: (error) => console.log("ERROR, LIKELY USER REJECT", error),
        onSuccess: (data) => addRecentTransaction({ hash: data?.hash, description: description ?? "" }),
    });

    const { data: receipt } = useWaitForTransaction({
        hash: sendData?.hash,
        chainId: txChain?.id,
    });

    const reset = useCallback(() => {
        setTxChain(undefined);
        txReset();
    }, [txReset, setTxChain]);

    const sendTxn = useCallback(() => {
        reset();

        console.log("SEND", sendData?.hash, receipt, txChain?.id);
        if (sendTransaction) {
            setTxChain(activeChain);
            sendTransaction();
        }
    }, [reset, sendTransaction, setTxChain, activeChain]);

    console.log("SEND", transactionRequest, enableEagerFetch, prepareConfig);

    return {
        pendingWalletSignature: isLoading,
        hash: sendData?.hash,
        explorerLink: getExplorerLink(sendData?.hash, ExplorerLinkType.TRANSACTION, txChain),
        chainId: txChain?.id,
        receipt,
        send: sendTransaction ? sendTxn : undefined,
        reset,
    };
}
