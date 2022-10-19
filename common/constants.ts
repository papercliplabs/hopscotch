import { zeroAddress } from "ethereumjs-util";
import { ethers } from "ethers";
import { chain } from "wagmi";

import { NativeBaseToken } from "./types";

export const URLS = {
  UNISWAP_TOKEN_LIST: "https://tokens.uniswap.org",
  COIN_GECKO_API: "https://api.coingecko.com/api/v3",
};

// Use SUPPORTED_CHAINS[0] as the dedault
export const SUPPORTED_CHAINS = [
  chain.polygon,
  // chain.polygonMumbai,
  // chain.goerli,
  chain.mainnet,
  // chain.optimism,
  // chain.arbitrum,
];

export const COIN_GECKO_API_PLATFORM_ID = {
  [chain.polygon.id]: "polygon-pos",
  // [chain.polygonMumbai.id]: undefined,
  // [chain.goerli.id]: undefined,
  [chain.mainnet.id]: "ethereum",
  // [chain.optimism.id]: "optimistic-ethereum",
  // [chain.arbitrum.id]: "arbitrum-one",
};

export const NATIVE_TOKENS: NativeBaseToken[] = [
  {
    address: ethers.constants.AddressZero,
    chainId: chain.polygon.id,
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
    wrappedAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  },
  {
    address: ethers.constants.AddressZero,
    chainId: chain.polygonMumbai.id,
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
    wrappedAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  },
  {
    address: ethers.constants.AddressZero,
    chainId: chain.goerli.id,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    wrappedAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  },
  {
    address: ethers.constants.AddressZero,
    chainId: chain.mainnet.id,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    wrappedAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  {
    address: ethers.constants.AddressZero,
    chainId: chain.optimism.id,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    wrappedAddress: "0x4200000000000000000000000000000000000006",
  },
  {
    address: ethers.constants.AddressZero,
    chainId: chain.arbitrum.id,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    wrappedAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  },
];

export const FEE_BIPS = 0; // No fee for now

export const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

export const MIN_SUCCESSFUL_TX_CONFIRMATIONS = 3;
