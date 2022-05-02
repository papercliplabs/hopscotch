import { WagmiProvider, chain } from "wagmi";

export enum SupportedChainId {
    MAINNET = chain.mainnet.id,
    MATIC = chain.polygonMainnet.id,
}

export enum SupportedToken {
    DAI = "DAI",
    USDC = "USDC",
    AAVE = "AAVE",
}
