import { AddressZero, MaxUint256 } from "@ethersproject/constants";
import { useMemo } from "react";
import { erc20ABI, useAccount, useContractRead, Address } from "wagmi";
import { BigNumber } from "@ethersproject/bignumber";

/**
 * Hook to get the token allowance of the spenderAddress for the tokenAddress
 * @param tokenAddress address of the token
 * @param spenderAddress address of the spender to get the token allownace for
 * @returns
 *      allowance: allowance tokens for the spender
 *      refetch: callback to refetch the allowance
 */
export function useTokenAllowance(
    tokenAddress?: Address,
    spenderAddress?: Address
): {
    allowance?: BigNumber;
    refetch: () => void;
} {
    const { address } = useAccount();

    const readDataPresent = useMemo(() => {
        return (
            tokenAddress != undefined &&
            tokenAddress != AddressZero &&
            address != undefined &&
            spenderAddress != undefined
        );
    }, [tokenAddress, address, spenderAddress]);

    const { data: allowance, refetch } = useContractRead({
        address: tokenAddress ?? AddressZero,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address ?? AddressZero, spenderAddress ?? AddressZero],
        enabled: readDataPresent,
    });

    function refetchInternal(): void {
        if (readDataPresent) {
            refetch();
        }
    }

    const finalAllowance = useMemo(() => {
        return tokenAddress == AddressZero ? MaxUint256 : allowance;
    }, [allowance, tokenAddress]);

    return { allowance: finalAllowance ? (allowance as unknown as BigNumber) : undefined, refetch: refetchInternal };
}
