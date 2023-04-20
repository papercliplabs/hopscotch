import { useEffect, useMemo } from "react";
import { BigNumber, Contract } from "ethers";
import { Address, useAccount, useContractRead } from "wagmi";
import { MaxUint256 } from "@ethersproject/constants";

import Erc20Abi from "@/abis/erc20.json";
import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import useSendTransaction, {
    SendTransactionResponse,
    TransactionStatus,
} from "@/hooks/transactions/useSendTransaction";

export default function useApproveErc20(
    token?: Address,
    minAmount?: BigNumber
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
        if (token) {
            const contract = new Contract(token, Erc20Abi);
            request = {
                to: contract.address,
                from: address,
                data: contract.interface.encodeFunctionData("approve", [HOPSCOTCH_ADDRESS, MaxUint256]),
            };
        }

        const requiresApproval = allowance ? (allowance as BigNumber).lt(minAmount ?? BigNumber.from("0")) : false;

        return [request, token != undefined && address != undefined, requiresApproval];
    }, [address, token, allowance, minAmount]);

    const response = useSendTransaction(transactionRequest, enableEagerFetch, "Approve");

    // Refetch allowance once transaction is confirmed
    useEffect(() => {
        if (response?.receipt?.status == TransactionStatus.Successful && refetchAllowance) {
            refetchAllowance();
        }
    }, [response?.receipt?.status, refetchAllowance]);

    return { ...response, requiresApproval };
}
