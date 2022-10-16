import { Length } from "./types";
import { Token as UniswapToken } from "@uniswap/sdk-core";
import { Chain, useNetwork, useToken } from "wagmi";
import { Token } from "./types";
import { add } from "lodash";
import { NATIVE_TOKENS, SUPPORTED_CHAINS } from "./constants";

/**
 * Format a number so it can nicely be rendered
 * @param num the number to be formatted, this can be a number or a string representation of a number. It should be less than 1 quintillion (10^15)
 * @param decimals the number of decimals to keep after formatting, if not specified it will keep 2
 * @returns nicely formatted number, for example if number is 11023 this will return 1.10K
 */
export function formatNumber(num: number | string, decimals: number = 2): string {
  const suffixes = ["", "K", "M", "B", "T"];

  let formattedNum = num;

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
  return +formattedNum.toFixed(decimals) + suffixes[suffixIndex];
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

export function getChainForId(chainId: number | undefined): Chain | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.id == chainId);
}

export function openLink(url: string | undefined, newTab: boolean): void {
  if (url) {
    if (newTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.open(url, "_self", "noopener,noreferrer");
    }
  } else {
    console.log("NO URL");
  }
}
