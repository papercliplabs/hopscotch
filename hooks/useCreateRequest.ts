import { useEffect, useMemo, useState } from "react";
import { useSigner, Address } from "wagmi";
import { TransactionRequest } from "@ethersproject/providers";
import { Transaction } from "@papercliplabs/rainbowkit";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";

import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import { useSendTransaction } from "./useSendTransaction";
import { useChain } from "./useChain";
import HopscotchAbi from "@/abis/hopscotch.json";
import { getNativeTokenAddress } from "@/common/utils";
import { AddressZero } from "@ethersproject/constants";

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
    requestTokenAddress?: Address,
    requestTokenAmount?: BigNumber
): {
    transaction?: Transaction;
    pendingWalletSignature: boolean;
    requestId?: BigNumber;
    abortPendingSignature: () => void;
    createRequest: () => Promise<string>;
    clearTransaction: () => void;
} {
    const [transactionRequest, setTransactionRequest] = useState<TransactionRequest>({});
    const [requestId, setRequestId] = useState<BigNumber | undefined>(undefined);
    const activeChain = useChain();
    const nativeTokenAddress = useMemo(() => {
        return getNativeTokenAddress(activeChain.id);
    }, [activeChain.id]);

    const { data: signer } = useSigner();
    const {
        transaction,
        receipt,
        pendingWalletSignature,
        abortPendingSignature,
        sendTransaction: createRequest,
        clearTransaction,
    } = useSendTransaction(transactionRequest, "createRequest", Object.keys(transactionRequest).length != 0);

    useEffect(() => {
        if (receipt && receipt.status == 1) {
            try {
                const id = BigNumber.from(receipt.logs[0].topics[1]);
                setRequestId(id);
            } catch (e) {
                console.log("UNABLE TO PARSE LOG", e, receipt);
            }
        }
    }, [receipt, setRequestId]);

    // Set transaction request
    useEffect(() => {
        async function configureTransaction() {
            let request = {};

            if (signer && requestTokenAddress && requestTokenAmount && nativeTokenAddress) {
                const contract = new Contract(HOPSCOTCH_ADDRESS, HopscotchAbi, signer);
                const address = await signer.getAddress();

                const requestTokenAddressInternal =
                    nativeTokenAddress == requestTokenAddress ? AddressZero : requestTokenAddress;

                request = {
                    from: address,
                    to: HOPSCOTCH_ADDRESS,
                    data: contract.interface.encodeFunctionData("createRequest", [
                        requestTokenAddressInternal,
                        requestTokenAmount,
                    ]),
                };
            }

            setTransactionRequest(request);
        }

        configureTransaction();
    }, [signer, requestTokenAddress, requestTokenAmount, setTransactionRequest, nativeTokenAddress]);

    return { transaction, pendingWalletSignature, requestId, abortPendingSignature, createRequest, clearTransaction };
}
