import { chain } from "wagmi";

export const URLS = {
  UNISWAP_TOKEN_LIST: "https://tokens.uniswap.org",
};

// Use SUPPORTED_CHAINS[0] as the dedault
export const SUPPORTED_CHAINS = [
  chain.polygon,
  chain.polygonMumbai,
  chain.ropsten,
  chain.mainnet,
  chain.optimism,
  chain.arbitrum,
];

export const FEE_BIPS = 100; // 1%

export const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

export const MIN_SUCCESSFUL_TX_CONFIRMATIONS = 1;
