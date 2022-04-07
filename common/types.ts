import { SupportedChainId, SupportedToken } from "./enums";

export interface ChainInfo {
  readonly network: string;
}

export type ChainInfoList = {
  [chainId in SupportedChainId]: ChainInfo;
};

export interface TokenInfo {
  readonly symbol: string;
  readonly address: string;
  readonly decimals: number;
}

export type TokenInfoList = {
  [token in SupportedToken]: TokenInfo;
};
