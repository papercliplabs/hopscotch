import { AddressZero, MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { erc20ABI, useAccount, useContractRead } from "wagmi";

/**
 * Hook to get the token allowance of the spenderAddress for the tokenAddress
 * @param tokenAddress address of the token
 * @param spenderAddress address of the spender to get the token allownace for
 * @returns
 *      allowance: allowance tokens for the spender
 *      refetch: callback to refetch the allowance
 */
export function useTokenAllowance(
  tokenAddress?: string,
  spenderAddress?: string
): {
  allowance?: BigNumber;
  refetch: () => void;
} {
  const { address } = useAccount();
  const { data: allowance, refetch } = useContractRead({
    addressOrName: tokenAddress ?? "",
    contractInterface: erc20ABI,
    functionName: "allowance",
    args: [address, spenderAddress],
    enabled:
      tokenAddress != undefined && tokenAddress != AddressZero && spenderAddress != undefined && address != undefined,
  });

  function refetchInternal(): void {
    refetch();
  }

  const finalAllowance = useMemo(() => {
    return tokenAddress == AddressZero ? MaxUint256 : allowance;
  }, [allowance, tokenAddress]);

  return { allowance: finalAllowance ? (allowance as unknown as BigNumber) : undefined, refetch: refetchInternal };
}
