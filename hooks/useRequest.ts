import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import { useContractRead } from "wagmi";
import { BigNumber } from "ethers/lib/ethers";

import HopscotchAbi from "@/abis/hopscotch.json";
import { useMemo } from "react";
import { stringToNumber } from "@/common/utils";

export interface Request {
    chainId: number;
    requestId: BigNumber;
    recipientAddress: string;
    recipientTokenAddress: string;
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
export function useRequest(chainId?: number, requestId?: string): Request | undefined {
    const requestIdInt = stringToNumber(requestId);

    const { data, refetch } = useContractRead({
        addressOrName: HOPSCOTCH_ADDRESS,
        contractInterface: HopscotchAbi,
        functionName: "getRequest",
        chainId: chainId,
        args: [requestIdInt],
        enabled: requestIdInt != undefined && chainId != undefined,
    });

    const request: Request | undefined = useMemo(() => {
        if (!data || requestIdInt == undefined || !chainId) {
            return undefined;
        }

        return {
            chainId: chainId,
            requestId: BigNumber.from(requestIdInt),
            recipientAddress: data[0],
            recipientTokenAddress: data[1],
            recipientTokenAmount: data[2],
            paid: data[3],
        };
    }, [data, requestIdInt]);

    return request;
}
