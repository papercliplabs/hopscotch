import { useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { erc20ABI, useSigner } from "wagmi";
import { TransactionRequest } from "@ethersproject/providers";
import { Transaction } from "@papercliplabs/rainbowkit";
import { AddressZero, MaxUint256 } from "@ethersproject/constants";

import { V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";
import { useSendTransaction } from "./useSendTransaction";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";

/**
 * Hook to get the allowance of the swap router for the erc20 token for the user, and provieds a callback to set approval
 * @param tokenAddress erc20 address
 * @param minimumApprovalAmount minimum amount that needs to be approved, if this is not met, calling approve will approve at least this amount
 * @returns
 *    requiresApproval: if the token requires approval to spend minimumApprovalAmount
 *    transaction: transaction from approve
 *    approve: callback to set the approval amount to at least the minimumApprovalAmount
 *    clearTransaction: clear the transaction if one exists, this is useful if it failed and requires a retry
 */
export function useApproveErc20ForSwap(
  tokenAddress?: string,
  minimumApprovalAmount?: BigNumber
): {
  requiresApproval?: Boolean;
  transaction?: Transaction;
  approve: () => Promise<string>;
  clearTransaction: () => void;
} {
  const [transcationRequest, setTranscationRequest] = useState<TransactionRequest>({});

  const { allowance, refetch: refetchAllowance } = useTokenAllowance(tokenAddress, V3_SWAP_ROUTER_ADDRESS);

  const { data: signer } = useSigner();
  const {
    transaction,
    sendTransaction: approve,
    clearTransaction,
  } = useSendTransaction(transcationRequest, "approve", Object.keys(transcationRequest).length != 0);

  // Set transaction request
  useEffect(() => {
    async function configureTransaction() {
      let request = {};

      if (signer && tokenAddress) {
        const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        const address = await signer.getAddress();

        request = {
          from: address,
          to: tokenAddress,
          // gasLimit: BigNumber.from("27000"), // Force fail
          data: contract.interface.encodeFunctionData("approve", [V3_SWAP_ROUTER_ADDRESS, MaxUint256]),
        };
      }

      setTranscationRequest(request);
    }

    configureTransaction();
  }, [tokenAddress, signer, setTranscationRequest]);

  // Refetch allowance on tx state change (TODO: this should be callback on tx completion)
  useEffect(() => {
    refetchAllowance();
  }, [transaction]);

  const requiresApproval = useMemo(() => {
    if (minimumApprovalAmount && allowance) {
      return allowance.lt(minimumApprovalAmount);
    } else {
      return undefined;
    }
  }, [allowance, minimumApprovalAmount]);

  return { requiresApproval, transaction, approve, clearTransaction };
}
