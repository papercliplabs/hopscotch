import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import { useContractRead, Address } from "wagmi";
import { BigNumber } from "ethers/lib/ethers";

import HopscotchAbi from "@/abis/hopscotch.json";
import { useMemo } from "react";

export interface Request {
    chainId: number;
    requestId: BigNumber;
    recipientAddress: Address;
    recipientTokenAddress: Address;
    recipientTokenAmount: BigNumber;
    paid: boolean;
}

/**
 * Hook to get the token allowance of the spenderAddress for the tokenAddress
 * @param tokenAddress address of the token
 * @param spenderAddress address of the spender to get the token allownace for
 * @returns
 *      allowance: allowance tokens for the spender
 *      refetch: callback to refetch the allowance
 */
export function useRequest(chainId?: number, requestId?: BigNumber): Request | undefined {
    const { data, refetch } = useContractRead({
        address: HOPSCOTCH_ADDRESS,
        abi: HopscotchAbi,
        functionName: "getRequest",
        chainId: chainId,
        args: [requestId],
        enabled: requestId != undefined && chainId != undefined,
    });

    console.log("USE REQ RENDERING");

    const request: Request | undefined = useMemo(() => {
        if (!data || requestId == undefined || !chainId || !Array.isArray(data)) {
            return undefined;
        }

        return {
            chainId: chainId,
            requestId: requestId,
            recipientAddress: data[0],
            recipientTokenAddress: data[1],
            recipientTokenAmount: data[2],
            paid: data[3],
        };
    }, [data, requestId]);

    return request;
}
