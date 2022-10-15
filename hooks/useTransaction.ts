import { useMemo } from "react";
import { useRecentTransactions, Transaction } from "@papercliplabs/rainbowkit";
import { useProvider, useTransaction as useWagmiTransaction, useWaitForTransaction } from "wagmi";

/**
 * Get the transaction corresponding to the hash
 * @param hash hash of the txn
 * @returns transaction for hash, undefined if it doesn't exist
 */
export function useTransaction(hash: string | undefined): Transaction | undefined {
  const localTransactions = useRecentTransactions();
  const provider = useProvider();

  const { data: transactionData } = useWagmiTransaction({
    hash: (hash ?? "") as `0x${string}`,
    enabled: hash != undefined,
  });

  const { data: transactionReceipt } = useWaitForTransaction({
    hash: (hash ?? "") as `0x${string}`,
    enabled: hash != undefined,
  });

  // Use local transaction if it exists, and fall back on fetching transaction data
  return useMemo(() => {
    let transaction = localTransactions.find((txn: Transaction) => txn.hash == hash);

    if (transaction == undefined && transactionData) {
      const status =
        transactionReceipt == undefined ? "pending" : transactionReceipt?.status == 0 ? "failed" : "confirmed";

      transaction = {
        hash: transactionData?.hash,
        description: "",
        status: status,
        confirmations: transactionReceipt?.confirmations ?? 0,
      };
    }

    return transaction;
  }, [localTransactions, hash, transactionData, transactionReceipt]);
}
