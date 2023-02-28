import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useSigner } from "wagmi";
import { TransactionRequest } from "@ethersproject/providers";
import { Transaction } from "@papercliplabs/rainbowkit";

import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import { useSendTransaction } from "./useSendTransaction";
import HopscotchAbi from "@/abis/hopscotch.json";

/**
 * Hook to create a request
 * @param requestTokenAddress token the request is for
 * @param requestTokenAmount amount of request token
 * @returns
 *    transaction: swap transaction from createRequest
 *    pendingWalletSignature: if the transaction is pending signature in a wallet
 *    abortPendingSignature: callback to abort pending wallet signature
 *    createRequest: execute the create request function on chain
 *    clearTransaction: clear the transaction if one exists, this is useful if it failed and requires a retry
 */
export function useCreateRequest(
    requestTokenAddress?: string,
    requestTokenAmount?: BigNumber
): {
    transaction?: Transaction;
    pendingWalletSignature: boolean;
    abortPendingSignature: () => void;
    createRequest: () => Promise<string>;
    clearTransaction: () => void;
} {
    const [transcationRequest, setTranscationRequest] = useState<TransactionRequest>({});

    const { data: signer } = useSigner();
    const {
        transaction,
        pendingWalletSignature,
        abortPendingSignature,
        sendTransaction: createRequest,
        clearTransaction,
    } = useSendTransaction(transcationRequest, "createRequest", Object.keys(transcationRequest).length != 0);

    // Set transaction request
    useEffect(() => {
        async function configureTransaction() {
            let request = {};

            if (signer && requestTokenAddress && requestTokenAmount) {
                const contract = new ethers.Contract(HOPSCOTCH_ADDRESS, HopscotchAbi, signer);
                const address = await signer.getAddress();

                request = {
                    from: address,
                    to: HOPSCOTCH_ADDRESS,
                    data: contract.interface.encodeFunctionData("createRequest", [
                        requestTokenAddress,
                        requestTokenAmount,
                    ]),
                };

                console.log(request, requestTokenAddress, requestTokenAmount);
            }

            setTranscationRequest(request);
        }

        configureTransaction();
    }, [signer, requestTokenAddress, requestTokenAmount, setTranscationRequest]);

    return { transaction, pendingWalletSignature, abortPendingSignature, createRequest, clearTransaction };
}
