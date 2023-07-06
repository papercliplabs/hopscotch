import { useMemo } from "react";
import { Address, useAccount } from "wagmi";
import { encodeFunctionData, zeroAddress } from "viem";

import HopscotchAbi from "@/abis/hopscotch.json";
import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import useSendTransaction, { SendTransactionResponse } from "./useSendTransaction";
import { getNativeTokenAddress } from "@/common/utils";
import { useChain } from "@/hooks/useChain";

export default function useCreateRequest(
    token?: Address,
    amount?: bigint
): SendTransactionResponse & { requestId: bigint | undefined } {
    const { address } = useAccount();

    const activeChain = useChain();
    const nativeTokenAddress = useMemo(() => {
        return getNativeTokenAddress(activeChain.id);
    }, [activeChain.id]);

    const [transactionRequest, enableEagerFetch] = useMemo(() => {
        const tokenInternal = nativeTokenAddress == token || token == undefined ? zeroAddress : token;
        return [
            {
                to: HOPSCOTCH_ADDRESS,
                from: address ?? zeroAddress,
                data: encodeFunctionData({
                    abi: HopscotchAbi,
                    functionName: "createRequest",
                    args: [tokenInternal, amount ?? BigInt("0")],
                }),
            },
            token != undefined && amount != undefined,
        ];
    }, [address, token, amount, nativeTokenAddress]);

    const response = useSendTransaction(transactionRequest, enableEagerFetch, "Create request");

    const requestId = useMemo(() => {
        if (response?.receipt?.logs[0]?.topics[1]) {
            return BigInt(response.receipt.logs[0].topics[1]);
        } else {
            return undefined;
        }
    }, [response]);

    return { ...response, requestId };
}
