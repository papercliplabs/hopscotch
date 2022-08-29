import { chain } from "wagmi";

export const URLS = {
  UNISWAP_TOKEN_LIST: "https://tokens.uniswap.org",
  COIN_GECKO_API: "https://api.coingecko.com/api/v3",
};

// Use SUPPORTED_CHAINS[0] as the dedault
export const SUPPORTED_CHAINS = [
  chain.polygon,
  chain.polygonMumbai,
  chain.rinkeby,
  chain.ropsten,
  chain.mainnet,
  chain.optimism,
  chain.arbitrum,
];

export const COIN_GECKO_API_PLATFORM_ID = {
  [chain.polygon.id]: "polygon-pos",
  [chain.polygonMumbai.id]: undefined,
  [chain.rinkeby.id]: undefined,
  [chain.ropsten.id]: undefined,
  [chain.mainnet.id]: "ethereum",
  [chain.optimism.id]: "optimistic-ethereum",
  [chain.arbitrum.id]: "arbitrum-one",
};

export const FEE_BIPS = 100; // 1%

export const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

export const MIN_SUCCESSFUL_TX_CONFIRMATIONS = 1;
