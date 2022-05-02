import { chain } from "wagmi";

import { CHAIN_INFO_LIST } from "./constants";
import { SupportedChainId } from "./enums";

/**
 * Get the rpc url for the specified chainId
 * @param chainId chain Id to get the Url for
 * @returns json RPC provider url if this chainId is supported, otherwise undefined
 */
export function getRpcUrlForChainId(chainId: number | undefined): string {
    if (chainId != undefined && chainId in SupportedChainId) {
        return CHAIN_INFO_LIST[chainId].rpcUrl;
    } else {
        return chain.mainnet.rpcUrls[0];
    }
}
