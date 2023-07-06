import { useEffect, useMemo } from "react";
import { Address, useAccount, useContractRead } from "wagmi";

import Erc20Abi from "@/abis/erc20.json";
import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import useSendTransaction, { SendTransactionResponse } from "@/hooks/transactions/useSendTransaction";
import { encodeFunctionData } from "viem";

export default function useApproveErc20(
    token?: Address,
    minAmount?: bigint
): SendTransactionResponse & { requiresApproval: boolean } {
    const { address } = useAccount();

    const { data: allowance, refetch: refetchAllowance } = useContractRead({
        address: token,
        abi: Erc20Abi,
        functionName: "allowance",
        args: [address, HOPSCOTCH_ADDRESS],
        enabled: token != undefined && address != undefined,
    });

    const [transactionRequest, enableEagerFetch, requiresApproval] = useMemo(() => {
        let request = undefined;
        if (token && address) {
            request = {
                to: token,
                from: address,
                data: encodeFunctionData({
                    abi: Erc20Abi,
                    functionName: "approve",
                    args: [HOPSCOTCH_ADDRESS, 250], // TODO: want max approve..
                }),
            };
        }

        const requiresApproval = allowance ? (allowance as bigint) < (minAmount ?? BigInt("0")) : false;

        return [request, token != undefined && address != undefined, requiresApproval];
    }, [address, token, allowance, minAmount]);

    const response = useSendTransaction(transactionRequest, enableEagerFetch, "Approve");

    // Refetch allowance once transaction is confirmed
    useEffect(() => {
        if (response?.receipt?.status == "success" && refetchAllowance) {
            refetchAllowance();
        }
    }, [response?.receipt?.status, refetchAllowance]);

    return { ...response, requiresApproval };
}
