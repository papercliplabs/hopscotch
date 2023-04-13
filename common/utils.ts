import { ExplorerLinkType, Length, Optional } from "./types";
import { NATIVE_TOKENS, NO_AMOUNT_DISPLAY, SUPPORTED_CHAINS } from "./constants";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { Address } from "wagmi";
import { Chain } from "wagmi";

/**
 * Format a number so it can nicely be rendered
 * @param num the number to be formatted, this can be a number or a string representation of a number. It should be less than 1 quintillion (10^15)
 * @param decimals the number of decimals to keep after formatting, if not specified it will keep 2
 * @param trimTrailingZeros if the number should have trailing zeros trimmed
 * @returns nicely formatted number, for example if number is 11023 this will return 1.10K
 */
export function formatNumber(
    num: number | string | undefined,
    decimals: number = 2,
    trimTrailingZeros: boolean = true
): string {
    const suffixes = ["", "", "M", "B", "T"];

    let formattedNum = num;

    if (formattedNum == undefined || isNaN(Number(num))) {
        return NO_AMOUNT_DISPLAY;
    }

    // If it is represented as a sting, convert to number first
    if (typeof formattedNum === "string") {
        formattedNum = parseFloat(formattedNum);

        if (isNaN(formattedNum)) {
            return num as string; // It isn't a number
        }
    }

    let suffixIndex = Math.floor((formattedNum.toFixed(0).toString().length - 1) / 3);

    // Clamp to max suffix
    if (suffixIndex >= suffixes.length) {
        suffixIndex = 0;
    }

    // Don't format below 1M
    if (formattedNum > 1e6) {
        formattedNum /= 10 ** (3 * suffixIndex);
    }

    // +number is clever trick to remove trailing zeros
    formattedNum = trimTrailingZeros ? +formattedNum.toFixed(decimals) : formattedNum.toFixed(decimals);
    return formattedNum + suffixes[suffixIndex];
}

/**
 * Format a token amount in a human readable way
 * @param tokenAmount token balance (ex 1e6 for 1 USDC)
 * @param tokenDecimals number of decimals the token balances uses
 * @param decimalPrecision nunber of decimals to keep
 */
export function formatTokenAmount(
    tokenAmount: Optional<BigNumber>,
    tokenDecimals: Optional<number>,
    decimalPrecision: number
): string {
    const tokens = tokenAmount && tokenDecimals ? formatUnits(tokenAmount, tokenDecimals) : undefined;

    return formatNumber(tokens, decimalPrecision);
}

/**
 * Parse a token amount from a human readable format
 * @param value
 * @param tokenDecimals
 * @returns
 */
export function parseTokenAmount(value: Optional<string>, tokenDecimals: Optional<number>): BigNumber | undefined {
    const tokens = value && tokenDecimals ? parseUnits(value, tokenDecimals) : undefined;
    return tokens;
}

/**
 * Format an address to a shorter version by adding ... in the middle
 * @param address address to be shortened
 * @param length the length to shorten the address to
 * @returns shortened address
 */
export function shortAddress(address: string | undefined, length: Length): string {
    if (!address) {
        return "";
    }
    const len = address.length;
    let keepLen = 12;
    switch (length) {
        case Length.SHORT:
            keepLen = 6;
            break;
        case Length.MEDIUM:
            keepLen = 10;
            break;
        case Length.LONG:
            keepLen = 20;
            break;
    }
    if (len < keepLen) {
        return address;
    } else {
        return address.slice(0, keepLen / 2) + "..." + address.slice(len - Math.max(4, keepLen / 2), len);
    }
}

export function getNativeTokenAddress(chainId?: number): Address | undefined {
    return NATIVE_TOKENS.find((token) => token.chainId == chainId)?.address;
}

/**
 * Get the wrapped token address for chain
 * @param chian chain to get the wrapped token address for
 */
export function getWrappedTokenAddress(chainId?: number): Address | undefined {
    return NATIVE_TOKENS.find((token) => token.chainId == chainId)?.wrappedAddress;
}

export function getSupportedChainIds(): Array<number> {
    return SUPPORTED_CHAINS.map((chain) => chain.id);
}

export function openLink(url: string | undefined, newTab: boolean): void {
    if (url) {
        if (newTab) {
            window.open(url, "_blank");
        } else {
            window.open(url, "_self");
        }
    } else {
        console.log("NO URL");
    }
}

export function stringToNumber(s: string | undefined): number | undefined {
    const parsedFloat = parseFloat(s ?? "");
    return isNaN(parsedFloat) ? undefined : parsedFloat;
}

export function getExplorerLink(
    hashOrAddress: string | undefined,
    linkType: ExplorerLinkType,
    chain: Chain | undefined
): string | undefined {
    const baseLink = chain?.blockExplorers?.default.url;

    if (baseLink && hashOrAddress) {
        return baseLink + "/" + linkType + "/" + hashOrAddress;
    } else {
        return undefined;
    }
}
