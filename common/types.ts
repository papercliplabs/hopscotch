import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";

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

/**
 * Generaly purpose length enum
 */
export enum Length {
  SHORT = 0,
  MEDIUM,
  LONG,
}

export enum LoadingStatus {
  IDLE,
  LOADING,
  ERROR,
  SUCCESS,
}

export enum SwapRouteState {
  INVALID,
  LOADING,
  VALID,
}

export enum TransactionState {
  PENDING,
  FAILED,
  SUCCESS,
}

export type TransactionDetails = {
  state: TransactionState;
  response: TransactionResponse;
  receipt?: TransactionReceipt;
};
