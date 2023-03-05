import { useCallback, useState } from "react";
import { BigNumber, BigNumberish } from "ethers";
import { TransactionRequest } from "@ethersproject/providers";
import { Transaction, useAddRecentTransaction } from "@papercliplabs/rainbowkit";
import { usePrepareSendTransaction, useSendTransaction as useWagmiSendTransaction } from "wagmi";

import { ethers } from "ethers";
import HopscotchAbi from "@/abis/hopscotch.json";

import { useTransaction } from "./useTransaction";
import { MIN_SUCCESSFUL_TX_CONFIRMATIONS } from "@/common/constants";
import { providers } from "ethers/lib/ethers";

/**
 * Hook to send a transaction, all transactions should be sent using this hook
 * @param transactionRequest transaction request to send
 * @param transactionDescription description of the transaction
 * @param enableEagerFetch if eager fetch of the request is enabled
 * @returns
 *  quotedGas: quoted gas for the transaction
 *  transaction: transaction that was sent or undefined if sendTransaction for the transactionRequest has not been called
 *  pendingWalletSignature: if the transaction is pending signature in a wallet
 *  abortPendingSignature: callback to abort pending wallet signature
 *  sendTransaction: callback to trigger sending of the transaction, returns TransactionResponse, or undefined if it failed
 *  clearTransaction: clear the transaction if one exists, this is useful if it failed and requires a retry
 */
export function useSendTransaction(
    transactionRequest: TransactionRequest,
    transactionDescription: string,
    enableEagerFetch: boolean = true
): {
    quotedGas?: BigNumber;
    transaction?: Transaction;
    receipt?: providers.TransactionReceipt;
    pendingWalletSignature: boolean;
    abortPendingSignature: () => void;
    sendTransaction: () => Promise<string>;
    clearTransaction: () => void;
} {
    const [hash, setHash] = useState<string>("");
    const [receipt, setReceipt] = useState<providers.TransactionReceipt | undefined>(undefined);
    const [pendingWalletSignature, setPendingWalletSignature] = useState<boolean>(false);

    const { error, config: prepareTransactionConfig } = usePrepareSendTransaction({
        request: transactionRequest,
        enabled: enableEagerFetch,
    });
    const { sendTransactionAsync, reset } = useWagmiSendTransaction(prepareTransactionConfig);
    const addRecentTransaction = useAddRecentTransaction();
    const transaction = useTransaction(hash);

    if (error) {
        console.log("ERROR_IN_TX_PREPARE", error);
    }

    if (transaction?.status == "failed") {
        console.log("TX FAILED", transaction);
    }

    console.log("REQ", transactionRequest, sendTransactionAsync);

    /**
     * Send transaction
     * @returns transaction hash, or INVALID_PARAMS
     */
    const sendTransaction = useCallback(async () => {
        let txHash = "INVALID_PARAMS";
        let txResponse = undefined;
        console.log("SEND TXN", error, sendTransactionAsync, transactionRequest);

        if (sendTransactionAsync) {
            setHash("");
            setReceipt(undefined);
            console.log("SEND TXN ACT");
            try {
                setPendingWalletSignature(true);
                txResponse = await sendTransactionAsync();
                console.log("tx response", txResponse);
                txHash = txResponse.hash;
                addRecentTransaction({
                    hash: txHash,
                    description: transactionDescription,
                    confirmations: MIN_SUCCESSFUL_TX_CONFIRMATIONS,
                });
            } catch (error) {
                // Likely user rejected
                console.log("ERROR SENDING", error);
            } finally {
                setPendingWalletSignature(false);
                setHash(txHash);
            }

            if (txResponse) {
                console.log("WAITING FOR TX RECEIPT");
                const txReceipt = await txResponse.wait();
                console.log("TX RECEIPT", txReceipt);
                setReceipt(txReceipt);
            }
        }

        return txHash;
    }, [sendTransactionAsync, addRecentTransaction, transactionRequest]);

    const abortPendingSignature = useCallback(async () => {
        // TODO(spennyp): also want to abort the actual await sendTransactionAsync()
        setPendingWalletSignature(false);
    }, [setPendingWalletSignature]);

    const clearTransaction = useCallback(() => {
        setHash("");
    }, [setHash]);

    return {
        quotedGas: prepareTransactionConfig?.request?.gasLimit as BigNumber,
        transaction,
        receipt,
        pendingWalletSignature,
        abortPendingSignature,
        sendTransaction,
        clearTransaction,
    };
}
