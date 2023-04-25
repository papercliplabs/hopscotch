import { AddressZero } from "@ethersproject/constants";
import { Percent } from "@uniswap/sdk-core";
import {
    localhost,
    mainnet,
    goerli,
    polygon,
    optimism,
    arbitrum,
    sepolia,
    polygonMumbai,
    optimismGoerli,
} from "wagmi/chains";

import { NativeBaseToken } from "./types";

export const NO_AMOUNT_DISPLAY = "--";

export const URLS = {
    UNISWAP_TOKEN_LIST: "https://tokens.uniswap.org",
    COIN_GECKO_API: "https://api.coingecko.com/api/v3",
};

// Use SUPPORTED_CHAINS[0] as the dedault
export const SUPPORTED_CHAINS = [
    // localhost,
    polygon,
    // polygonMumbai,
    // goerli,
    // sepolia,
    // mainnet,
    // optimism,
    // optimismGoerli,
    // arbitrum,
];

export const COIN_GECKO_API_PLATFORM_ID = {
    [localhost.id]: undefined,
    [polygon.id]: "polygon-pos",
    // [polygonMumbai.id]: undefined,
    [goerli.id]: undefined,
    // [sepolia.id]: undefined,
    [mainnet.id]: "ethereum",
    // [optimism.id]: "optimistic-ethereum",
    // [arbitrum.id]: "arbitrum-one",
};

export const NATIVE_TOKENS: NativeBaseToken[] = [
    {
        // Assuming forking polygon
        address: "0x0000000000000000000000000000000000001010",
        chainId: localhost.id,
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
        wrappedAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    {
        address: "0x0000000000000000000000000000000000001010",
        chainId: polygon.id,
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
        wrappedAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    {
        address: "0x0000000000000000000000000000000000001010",
        chainId: polygonMumbai.id,
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
        wrappedAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    },
    {
        address: AddressZero,
        chainId: goerli.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    },
    {
        address: AddressZero,
        chainId: sepolia.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa",
    },
    {
        address: AddressZero,
        chainId: mainnet.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
        address: AddressZero,
        chainId: optimism.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0x4200000000000000000000000000000000000006",
    },
    {
        address: AddressZero,
        chainId: optimismGoerli.id,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        wrappedAddress: "0x4200000000000000000000000000000000000006",
    },
    {
        address: AddressZero,
        chainId: arbitrum.id,
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
export const HOPSCOTCH_ADDRESS = "0x92Ef06DBcCf841194437AfAc61BbcD5E3530fAdB";

export const SUPPORTED_NATIVE_TOKENS = NATIVE_TOKENS.filter((token) =>
    SUPPORTED_CHAINS.map((chain) => chain.id).find((id) => id == token.chainId)
);
