import { ExplorerLinkType, Length, Optional } from "./types";
import { HOPSCOTCH_ADDRESS, NATIVE_TOKENS, NO_AMOUNT_DISPLAY, SUPPORTED_CHAINS } from "./constants";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { Address } from "wagmi";
import { Chain } from "wagmi";
import { Contract, BigNumber, ethers } from "ethers";
import { jsNumberForAddress } from "react-jazzicon";
import { AddressZero } from "@ethersproject/constants";

import HopscotchAbi from "@/abis/hopscotch.json";
import { fetchEnsAddress, fetchEnsAvatar, fetchEnsName, readContract } from "@wagmi/core";

/**
 * Format a number so it can nicely be rendered
 * @param num the number to be formatted, this can be a number or a string representation of a number. It should be less than 1 quintillion (10^15)
 * @param decimals the number of decimals to keep after formatting, if not specified it will keep 2
 * @param trimTrailingZeros if the number should have trailing zeros trimmed
 * @returns nicely formatted number, for example if number is 11023 this will return 1.10K
 */
export function formatNumber(num: number | string | undefined, decimals: number = 2, prefix: string = ""): string {
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

    if (formattedNum < 10 ** -decimals && formattedNum > 0) {
        formattedNum = "<" + prefix + 10 ** -decimals;
    } else {
        let nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals });
        formattedNum = prefix + nf.format(formattedNum);
    }

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

export function getNativeTokenLogoUri(chainId?: number): string | undefined {
    return NATIVE_TOKENS.find((token) => token.chainId == chainId)?.logoURI;
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

export interface EnsInfo {
    name?: string;
    backgroundImg?: string;
}

export async function fetchEnsInfo(address?: Address): Promise<EnsInfo> {
    // Removing manual ENS for now, since even with, not sync with rainbow kit
    // const provider = new ethers.providers.AlchemyProvider("mainnet", process.env.NEXT_PUBLIC_ALCHEMY_ID);
    // const name = await provider.lookupAddress(address ?? AddressZero);
    // const image = await provider.getAvatar(name ?? "");

    const name = undefined; //await fetchEnsName({ address: address ?? AddressZero, chainId: 1 });
    const image = undefined; // await fetchEnsAvatar({ address: address ?? AddressZero, chainId: 1 });

    return { name: name ?? undefined, backgroundImg: image ? `url(${image})` : undefined };
}

export function getDefaultLinearGradientForAddress(address?: Address) {
    const number = Math.ceil(jsNumberForAddress(address ?? "") % 0xffffff);
    return `linear-gradient(45deg, #${number.toString(16).padStart(6, "0")}, #FFFFFF)`;
}

export interface Request {
    chainId: number;
    requestId: BigNumber;
    recipientAddress: Address;
    recipientTokenAddress: Address;
    recipientTokenAmount: BigNumber;
    paid: boolean;
}

export async function fetchRequest(requestId?: BigNumber, chainId?: number): Promise<Request | undefined> {
    if (requestId && chainId) {
        const data = (await readContract({
            address: HOPSCOTCH_ADDRESS,
            abi: HopscotchAbi,
            chainId: chainId ?? 1,
            functionName: "getRequest",
            args: [requestId],
        })) as Array<any>;

        return {
            chainId: chainId,
            requestId: requestId,
            recipientAddress: data[0],
            recipientTokenAddress: data[1],
            recipientTokenAmount: data[2],
            paid: data[3],
        };
    } else {
        return undefined;
    }
}
