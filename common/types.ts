import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import { BigNumber } from "ethers";

export interface BaseToken {
  readonly address: string;
  readonly chainId: number;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly logoURI: string;
}

export interface Token extends BaseToken {
  priceUsd?: number;
  balance?: BigNumber;
  balanceUsd?: number;
}

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
