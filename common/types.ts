import { Address, Chain as WagmiChain } from "wagmi";
import { RainbowKitChain } from "@papercliplabs/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext";
import { BigNumber } from "@ethersproject/bignumber";

export interface BaseToken {
    readonly address: Address;
    readonly wrappedAddress?: Address | undefined;
    readonly chainId: number;
    readonly name: string;
    readonly symbol: string;
    readonly decimals: number;
    readonly logoURI: string;
}

export interface NativeBaseToken extends BaseToken {
    readonly wrappedAddress: Address;
}

export interface Token extends BaseToken {
    priceUsd?: number;
    balance?: BigNumber;
    balanceUsd?: number;
}

export type Chain = WagmiChain & RainbowKitChain;

export type Optional<T> = T | undefined;

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

export enum ExplorerLinkType {
    TOKEN = "token",
    WALLET_OR_CONTRACT = "address",
    TRANSACTION = "tx",
}
