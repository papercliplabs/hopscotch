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
    chain.goerli,
    chain.mainnet,
    // chain.optimism,
    // chain.arbitrum,
];

export const COIN_GECKO_API_PLATFORM_ID = {
    [chain.polygon.id]: "polygon-pos",
    // [chain.polygonMumbai.id]: undefined,
    [chain.goerli.id]: undefined,
    [chain.mainnet.id]: "ethereum",
    // [chain.optimism.id]: "optimistic-ethereum",
    // [chain.arbitrum.id]: "arbitrum-one",
};

export const NATIVE_TOKENS: NativeBaseToken[] = [
    {
        address: "0x0000000000000000000000000000000000001010",
        chainId: chain.polygon.id,
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
        wrappedAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    {
        address: "0x0000000000000000000000000000000000001010",
        chainId: chain.polygonMumbai.id,
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
        wrappedAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    },
    {
        address: ethers.constants.AddressZero,
        chainId: chain.goerli.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    },
    {
        address: ethers.constants.AddressZero,
        chainId: chain.mainnet.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
        address: ethers.constants.AddressZero,
        chainId: chain.optimism.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0x4200000000000000000000000000000000000006",
    },
    {
        address: ethers.constants.AddressZero,
        chainId: chain.arbitrum.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    },
];

export const FEE_BIPS = 0; // No fee for now

export const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
export const HOPSCOTCH_ADDRESS = "0x3a009c3f8f5ed1979cc9c9f6272339c0d29f7887";

export const MIN_SUCCESSFUL_TX_CONFIRMATIONS = 1;
