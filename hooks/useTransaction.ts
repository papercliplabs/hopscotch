import { useMemo } from "react";
import { useRecentTransactions, Transaction } from "@papercliplabs/rainbowkit";

/**
 * Get the transaction corresponding to the hash
 * @param hash hash of the txn
 * @returns transaction for hash, undefined if it doesn't exist
 */
export function useTransaction(hash: string): Transaction | undefined {
  const transactions = useRecentTransactions();

  return useMemo(() => {
    return transactions.find((txn: Transaction) => txn.hash == hash);
  }, [transactions, hash]);
}
