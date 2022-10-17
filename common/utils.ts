import { Length, Optional } from "./types";
import { Token as UniswapToken } from "@uniswap/sdk-core";
import { Chain, useNetwork, useToken } from "wagmi";
import { Token } from "./types";
import { add } from "lodash";
import { NATIVE_TOKENS, SUPPORTED_CHAINS } from "./constants";
import { BigNumber, ethers } from "ethers";

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
  const suffixes = ["", "K", "M", "B", "T"];

  let formattedNum = num;

  if (formattedNum == undefined || isNaN(Number(num))) {
    return "--";
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

  formattedNum /= 10 ** (3 * suffixIndex);

  // +number is clever trick to remove trailing zeros
  formattedNum = trimTrailingZeros ? +formattedNum.toFixed(decimals) : formattedNum.toFixed(decimals);
  return formattedNum + suffixes[suffixIndex];
}

/**
 * Format a token balance in a human readable way
 * @param tokenBalance token balance (ex 1e6 for 1 USDC)
 * @param tokenDecimals number of decimals the token balances uses
 * @param decimalPrecision nunber of decimals to keep
 */
export function formatTokenBalance(
  tokenBalance: Optional<BigNumber>,
  tokenDecimals: Optional<number>,
  decimalPrecision: number
): string {
  const tokens = tokenBalance && tokenDecimals ? ethers.utils.formatUnits(tokenBalance, tokenDecimals) : undefined;

  return formatNumber(tokens, decimalPrecision);
}

/**
 * Format an address to a shorter version by adding ... in the middle
 * @param address address to be shortened
 * @param length the length to shorten the address to
 * @returns shortened address
 */
export function shortAddress(address: string, length: Length): string {
  const len = address.length;
  let keepLen = 12;
  switch (length) {
    case Length.SHORT:
      keepLen = 6;
      break;
    case Length.MEDIUM:
      keepLen = 12;
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

/**
 * Get the wrapped token address for chain
 * @param chian chain to get the wrapped token address for
 */
export function getWrappedTokenAddress(chainId: number): string | undefined {
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
