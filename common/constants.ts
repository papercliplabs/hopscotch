import { ChainInfoList, TokenInfoList } from "./types";
import { SupportedChainId, SupportedToken } from "./enums";
import { chain } from "wagmi";

export const URLS = {
    UNISWAP_TOKEN_LIST: "https://tokens.uniswap.org",
};

export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [SupportedChainId.MATIC];

export const CHAIN_INFO_LIST: ChainInfoList = {
    [SupportedChainId.MAINNET]: {
        name: chain.mainnet.name,
        rpcUrl: process.env.MAINNET_RPC_URL,
    },
    [SupportedChainId.MATIC]: {
        name: chain.polygonMainnet.name,
        rpcUrl: process.env.MATIC_RPC_URL,
    },
};

export const SUPPORTED_TOKENS: SupportedToken[] = [SupportedToken.DAI, SupportedToken.USDC, SupportedToken.AAVE];

export const TOKEN_INFO_LIST: TokenInfoList = {
    [SupportedToken.DAI]: {
        symbol: "DAI",
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        decimals: 18,
    },
    [SupportedToken.USDC]: {
        symbol: "USDC",
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        decimals: 6,
    },
    [SupportedToken.AAVE]: {
        symbol: "AAVE",
        address: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
        decimals: 18,
    },
};
