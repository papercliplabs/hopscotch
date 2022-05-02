import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";

import ERC20_ABI from "../abis/erc20.json";
import { useEffect, useState } from "react";
import { SupportedChainId } from "./enums";
import { Token } from "./types";
import { URLS } from "./constants";

export function useERC20Contract(tokenAddress: string): Contract | undefined {
    const { active, account, library } = useWeb3React();

    if (active) {
        const signer = library.getSigner(account);
        return new Contract(tokenAddress, ERC20_ABI, signer);
    } else {
        return undefined;
    }
}

/**
 * Get list of all supported tokens for chainId
 * @param chainId chainId to get supported tokens for
 * @returns list of all supported tokens for chainId
 */
export function useTokenList(chainId: SupportedChainId): Token[] {
    const [allTokens, setAllTokens] = useState<Token[]>([]);

    useEffect(() => {
        async function checkForData() {
            // Fetch the data if it hasn't been fetched already
            if (allTokens.length == 0) {
                console.log("FETCH TOKEN LIST");
                fetch(URLS.UNISWAP_TOKEN_LIST)
                    .then((response) => response.json())
                    .then((data) => {
                        const tokens = data.tokens;
                        const allTokens: Token[] = [];
                        for (const token of tokens) {
                            allTokens.push(token as Token);
                        }

                        setAllTokens(allTokens);
                    });
            }
        }

        checkForData();
    }, [allTokens, setAllTokens]);

    return allTokens.filter((token) => token.chainId == chainId);
}
