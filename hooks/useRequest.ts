import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import { useContractRead, Address } from "wagmi";
import { readContract } from "wagmi/actions";

import HopscotchAbi from "@/abis/hopscotch.json";
import { useMemo } from "react";
import { createPublicClient } from "viem";

export interface Request {
    chainId: number;
    requestId: bigint;
    recipientAddress: Address;
    recipientTokenAddress: Address;
    recipientTokenAmount: bigint;
    paid: boolean;
}

export async function fetchRequest(requestId?: bigint, chainId?: number): Promise<Request | undefined> {
    if (requestId && chainId) {
        const data = (await readContract({
            address: HOPSCOTCH_ADDRESS,
            abi: HopscotchAbi,
            chainId: chainId ?? 1,
            functionName: "getRequest",
            args: [requestId],
        })) as Array<any>;

        return {
            chainId: chainId,
            requestId: requestId,
            recipientAddress: data[0],
            recipientTokenAddress: data[1],
            recipientTokenAmount: data[2],
            paid: data[3],
        };
    } else {
        return undefined;
    }
}

/**
 * Hook to get the token allowance of the spenderAddress for the tokenAddress
 * @param tokenAddress address of the token
 * @param spenderAddress address of the spender to get the token allownace for
 * @returns
 *      allowance: allowance tokens for the spender
 *      refetch: callback to refetch the allowance
 */
export function useRequest(chainId?: number, requestId?: bigint): Request | undefined {
    const { data, refetch } = useContractRead({
        address: HOPSCOTCH_ADDRESS,
        abi: HopscotchAbi,
        functionName: "getRequest",
        chainId: chainId,
        args: [requestId],
        enabled: requestId != undefined && chainId != undefined,
    });

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
