import { useToken } from "wagmi";

import { Token } from "@/common/types";

/**
 * Get a token from an address
 * @param address address of token to get
 */
export function useTokenFromAddress(address: string | undefined, chainId: number | undefined): Token | undefined {
  // TODO: make this not shitty
  const wagmiToken = useToken({ address: address, chainId: chainId });

  if (!address || !chainId || !wagmiToken || !wagmiToken.data) {
    return undefined;
  }

  const token: Token = {
    chainId: chainId,
    address: wagmiToken.data!.address,
    name: wagmiToken.data!.symbol,
    symbol: wagmiToken.data!.symbol,
    decimals: wagmiToken.data!.decimals,
    logoURI: "",
  };

  return token;
}
