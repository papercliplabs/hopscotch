import { chain } from "wagmi";

export const URLS = {
  UNISWAP_TOKEN_LIST: "https://tokens.uniswap.org",
};

// Use SUPPORTED_CHAINS[0] as the dedault
export const SUPPORTED_CHAINS = [chain.polygon, chain.mainnet, chain.optimism, chain.arbitrum];

export const FEE_BIPS = 100; // 1%
