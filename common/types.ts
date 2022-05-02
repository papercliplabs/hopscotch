import { SupportedChainId } from "./enums";

export interface ChainInfo {
    readonly name: string;
    readonly rpcUrl: string;
}

export type ChainInfoList = {
    [chainId in SupportedChainId]: ChainInfo;
};

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
