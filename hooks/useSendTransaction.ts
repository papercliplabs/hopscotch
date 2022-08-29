import { useCallback, useState } from "react";
import { BigNumber, BigNumberish } from "ethers";
import { TransactionRequest } from "@ethersproject/providers";
import { Transaction, useAddRecentTransaction } from "@papercliplabs/rainbowkit";
import { usePrepareSendTransaction, useSendTransaction as useWagmiSendTransaction } from "wagmi";

import { useTransaction } from "./useTransaction";
import { MIN_SUCCESSFUL_TX_CONFIRMATIONS } from "@/common/constants";

/**
 * Hook to send a transaction, all transactions should be sent using this hook
 * @param transactionRequest transaction request to send
 * @param transactionDescription description of the transaction
 * @param enableEagerFetch if eager fetch of the request is enabled
 * @returns
 *  quotedGas: quoted gas for the transaction
 *  transaction: transaction that was sent or undefined if sendTransaction for the transactionRequest has not been called
 *  sendTransaction: callback to trigger sending of the transaction, returns TransactionResponse, or undefined if it failed
 */
export function useSendTransaction(
  transactionRequest: TransactionRequest,
  transactionDescription: string,
  enableEagerFetch: boolean = true
): {
  quotedGas?: BigNumber;
  transaction?: Transaction;
  sendTransaction: () => Promise<string>;
} {
  const [hash, setHash] = useState<string>("");

  const { error, config: prepareTransactionConfig } = usePrepareSendTransaction({
    request: transactionRequest,
    enabled: enableEagerFetch,
  });
  const { sendTransactionAsync } = useWagmiSendTransaction(prepareTransactionConfig);
  const addRecentTransaction = useAddRecentTransaction();
  const transaction = useTransaction(hash);

  if (error) {
    console.log("ERROR_IN_TX_PREPARE", error);
  }

  if (transaction?.status == "failed") {
    console.log("TX FAILED", transaction);
  }

  /**
   * Send transaction
   * @returns transaction hash, or INVALID_PARAMS
   */
  const sendTransaction = useCallback(async () => {
    let txHash = "INVALID_PARAMS";

    if (sendTransactionAsync) {
      const txResponse = await sendTransactionAsync();
      txHash = await txResponse.hash;
      addRecentTransaction({
        hash: txHash,
        description: transactionDescription,
        confirmations: MIN_SUCCESSFUL_TX_CONFIRMATIONS,
      });
    }

    setHash(txHash);
    return txHash;
  }, [sendTransactionAsync, addRecentTransaction]);

  return { quotedGas: prepareTransactionConfig?.request?.gasLimit as BigNumber, transaction, sendTransaction };
}
