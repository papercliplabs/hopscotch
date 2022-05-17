/**
 * Token matching the output of https://tokens.uniswap.org
 */
export type Token = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};
