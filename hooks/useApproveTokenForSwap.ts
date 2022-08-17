import { useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { erc20ABI, useSigner } from "wagmi";
import { TransactionRequest } from "@ethersproject/providers";
import { Transaction } from "@papercliplabs/rainbowkit";
import { MaxUint256 } from "@ethersproject/constants";

import { V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";
import { useSendTransaction } from "./useSendTransaction";

/**
 * Hook to get the allowance of the swap router for the erc20 token for the user, and provieds a callback to set approval
 * @param tokenAddress erc20 address
 * @param minimumApprovalAmount minimum amount that needs to be approved, if this is not met, calling approve will approve at least this amount
 * @returns
 *    requiresApproval: if the token requires approval to spend minimumApprovalAmount
 *    transaction: transaction from approve
 *    approve: callback to set the approval amount to at least the minimumApprovalAmount
 */
export function useApproveErc20ForSwap(
  tokenAddress?: string,
  minimumApprovalAmount?: BigNumber
): {
  requiresApproval?: Boolean;
  transaction?: Transaction;
  approve: () => Promise<string>;
} {
  const [allowance, setAllowance] = useState<BigNumber | undefined>(undefined);
  const [transcationRequest, setTranscationRequest] = useState<TransactionRequest>({});

  const { data: signer } = useSigner();
  const { transaction, sendTransaction: approve } = useSendTransaction(
    transcationRequest,
    "approve",
    Object.keys(transcationRequest).length != 0
  );

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
          data: contract.interface.encodeFunctionData("approve", [V3_SWAP_ROUTER_ADDRESS, MaxUint256]),
        };
      }

      setTranscationRequest(request);
    }

    configureTransaction();
  }, [tokenAddress, signer, setTranscationRequest]);

  // Set allowance
  useEffect(() => {
    async function getAllowance() {
      if (signer && tokenAddress) {
        const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        const allowance = await contract.allowance(signer.getAddress(), V3_SWAP_ROUTER_ADDRESS);
        setAllowance(allowance);
      }
    }

    getAllowance();
  }, [signer, tokenAddress, setAllowance, transaction]);

  const requiresApproval = useMemo(() => {
    if (minimumApprovalAmount && allowance) {
      return allowance.lt(minimumApprovalAmount);
    } else {
      return undefined;
    }
  }, [allowance, minimumApprovalAmount]);

  return { requiresApproval, transaction, approve };
}
