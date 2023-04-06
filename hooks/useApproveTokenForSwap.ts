import { useEffect, useMemo, useState } from "react";
import { erc20ABI, useSigner, Address } from "wagmi";
import { Transaction } from "@papercliplabs/rainbowkit";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { TransactionRequest } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import { useSendTransaction } from "./useSendTransaction";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";

/**
 * Hook to get the allowance of the swap router for the erc20 token for the user, and provieds a callback to set approval
 * @param tokenAddress erc20 address
 * @param minimumApprovalAmount minimum amount that needs to be approved, if this is not met, calling approve will approve at least this amount
 * @returns
 *    requiresApproval: if the token requires approval to spend minimumApprovalAmount
 *    transaction: transaction from approve
 *    pendingConfirmation: if the transaction is pending confirmation in a wallet
 *    approve: callback to set the approval amount to at least the minimumApprovalAmount
 *    clearTransaction: clear the transaction if one exists, this is useful if it failed and requires a retry
 */
export function useApproveErc20ForSwap(
    tokenAddress?: Address,
    minimumApprovalAmount?: BigNumber
): {
    requiresApproval?: boolean;
    transaction?: Transaction;
    pendingWalletSignature: boolean;
    abortPendingSignature: () => void;
    approve: () => Promise<string>;
    clearTransaction: () => void;
} {
    const [transcationRequest, setTranscationRequest] = useState<TransactionRequest>({});

    const { allowance, refetch: refetchAllowance } = useTokenAllowance(tokenAddress, HOPSCOTCH_ADDRESS);

    const { data: signer } = useSigner();
    const {
        transaction,
        pendingWalletSignature,
        abortPendingSignature,
        sendTransaction: approve,
        clearTransaction,
    } = useSendTransaction(transcationRequest, "approve", Object.keys(transcationRequest).length != 0);

    // Set transaction request
    useEffect(() => {
        async function configureTransaction() {
            let request = {};

            if (signer && tokenAddress) {
                const contract = new Contract(tokenAddress, erc20ABI, signer);
                const address = await signer.getAddress();

                request = {
                    from: address,
                    to: tokenAddress,
                    data: contract.interface.encodeFunctionData("approve", [HOPSCOTCH_ADDRESS, MaxUint256]),
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

    return { requiresApproval, transaction, pendingWalletSignature, abortPendingSignature, approve, clearTransaction };
}
