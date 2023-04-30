import { useContext, createContext, ReactNode, useEffect, useState, useMemo } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { Address, erc20ABI, useAccount, useContractReads } from "wagmi";

import { BaseToken, Token } from "@/common/types";
import {
    COIN_GECKO_API_PLATFORM_ID,
    NATIVE_TOKENS,
    SUPPORTED_CHAINS,
    URLS,
    SUPPORTED_NATIVE_TOKENS,
} from "@/common/constants";
import { wagmiClient } from "@/pages/_app";
import { getSupportedChainIds } from "@/common/utils";
import { mapValues, merge, isEmpty } from "lodash/fp";

const PAGE_SIZE = 150;

type TokenListProviderInterface = {
    tokens: Token[];
};

type TokenPriceDict = {
    [key: string]: number;
};

const TokenListContext = createContext<TokenListProviderInterface>({ tokens: Array<Token>() });

async function getPriceInfoForAddresses(coinGeckoPlatformId: string, addresses: string[]) {
    try {
        const url = new URL(`${URLS.COIN_GECKO_API}/simple/token_price/${coinGeckoPlatformId}`);
        const urlSearchParams = new URLSearchParams({
            contract_addresses: addresses.join(","),
            vs_currencies: "usd",
        });
        url.search = urlSearchParams.toString();

        const response = await fetch(url.toString());
        const data = await response.json();
        const transformedData = mapValues("usd")(data);
        return transformedData;
    } catch (error) {
        console.error("ERROR WITH COINGECKO REQ: ", error);
        return {};
    }
}

const getByKeyCaseInsensitive = (obj: any, key: any) => {
    if (!obj || !key) {
        return undefined;
    }
    const keys = Object.keys(obj);
    const keyIndex = keys.findIndex((k) => k.toLowerCase() === key.toLowerCase());
    return obj[keys[keyIndex]];
};

function getPrice(token: BaseToken, prices: object) {
    const { address, wrappedAddress } = token;

    const primaryPrice = getByKeyCaseInsensitive(prices, address);
    const wrappedPrice = getByKeyCaseInsensitive(prices, wrappedAddress);

    return primaryPrice || wrappedPrice;
}

export function useTokenListContext() {
    return useContext(TokenListContext);
}

export default function TokenListProvider({ children }: { children: ReactNode }) {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [baseTokens, setBaseTokens] = useState<BaseToken[]>([]);
    const [prices, setPrices] = useState<TokenPriceDict>({});
    const [nativeTokenBalances, setNativeTokenBalances] = useState<BigNumber[]>([]);

    const { address } = useAccount();

    ////
    // Fetch base tokens
    ////
    useEffect(() => {
        async function checkForBaseList() {
            // Fetch the data if it hasn't been fetched already
            if (baseTokens.length == 0) {
                fetch(URLS.UNISWAP_TOKEN_LIST)
                    .then((response) => response.json())
                    .then((data) => {
                        let tokens = data.tokens as Array<BaseToken>;

                        // Filter for only chains we are on, remove duplicates, and remove native tokens
                        const supportedChainIds = getSupportedChainIds();

                        // Weird bug with useContractReads putting lower chains first, so just order by chainId
                        supportedChainIds.sort((a, b) => (a < b ? -1 : 1));

                        const supportedTokens: BaseToken[] = [];
                        for (let id of supportedChainIds) {
                            let addresses: Address[] = [];
                            const isTestNet = id == 1337;
                            const tokensForChain = tokens.filter(
                                (token) => token.chainId == id || (isTestNet && token.chainId == 137)
                            );
                            const nativeToken = NATIVE_TOKENS.find((token) => token.chainId == id);

                            for (let token of tokensForChain) {
                                // Filter duplicates, and also native token
                                if (!addresses.includes(token.address) && !(nativeToken?.address == token.address)) {
                                    supportedTokens.push({
                                        address: token.address.toLowerCase() as Address,
                                        chainId: token.chainId,
                                        decimals: token.decimals,
                                        logoURI: token.logoURI.replace("thumb", "small"), // Use higher resolution images from coin gecko
                                        name: token.name,
                                        symbol: token.symbol,
                                    });
                                }
                            }
                        }

                        setBaseTokens(supportedTokens);
                    });
            }
        }

        checkForBaseList();
    }, [baseTokens, setBaseTokens]);

    ////
    // Fetch token Usd prices (best effort)
    ////
    useEffect(() => {
        async function checkForPrices() {
            // Fetch the data if it hasn't been fetched already

            if (baseTokens.length != 0 && isEmpty(prices)) {
                let priceData = {};
                for (let chain of SUPPORTED_CHAINS) {
                    const nativeTokenWrappedAddresses = NATIVE_TOKENS.filter((token) => token.chainId == chain.id).map(
                        (token) => token.wrappedAddress
                    );
                    const baseTokenAddresses = baseTokens
                        .filter((token) => token.chainId == chain.id)
                        .map((token) => token.address);
                    const addresses = [...nativeTokenWrappedAddresses, ...baseTokenAddresses];

                    const coinGeckoPlatformId = COIN_GECKO_API_PLATFORM_ID[chain.id];

                    if (coinGeckoPlatformId && addresses.length != 0) {
                        let pages = addresses.length / PAGE_SIZE;

                        // Get 414 request to big without pageing this
                        for (let page = 0; page < pages; page++) {
                            const addressChunks = addresses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
                            const data = await getPriceInfoForAddresses(coinGeckoPlatformId, addressChunks);
                            priceData = merge(priceData, data);
                        }
                    }
                }

                setPrices(priceData);
            }
        }

        checkForPrices();
    }, [baseTokens, prices, setPrices]);

    ////
    // Fetch token balances
    ////
    const readBalanceContractData = useMemo(() => {
        if (address != undefined && baseTokens != undefined && baseTokens.length > 0) {
            return baseTokens.map((token) => {
                return {
                    address: token.address,
                    abi: erc20ABI,
                    functionName: "balanceOf",
                    args: [address],
                    chainId: token.chainId,
                };
            });
        } else {
            return [];
        }
    }, [baseTokens, address]);

    // Weird bug where this will reorder by chainId
    const { data: balanceResults, error } = useContractReads({
        contracts: readBalanceContractData,
        enabled: readBalanceContractData.length != 0 && address != undefined,
    });

    const balances = useMemo(() => {
        let ret = undefined;

        if (balanceResults) {
            ret = balanceResults.map((result) => {
                return result as unknown as BigNumber;
            });
        }

        return ret;
    }, [balanceResults]);

    ////
    // Fetch balances of native tokens (a bit ugly)
    ////
    useEffect(() => {
        async function getNativeTokenBalances() {
            if (address && typeof wagmiClient.config.provider === "function") {
                let nativeBalances: BigNumber[] = [];
                for (const chain of SUPPORTED_CHAINS) {
                    const provider = wagmiClient.config.provider({ chainId: chain.id });
                    const bal = await provider.getBalance(address);
                    nativeBalances.push(bal);
                }
                setNativeTokenBalances(nativeBalances);
            }
        }

        getNativeTokenBalances();
    }, [setNativeTokenBalances, address, wagmiClient.config.provider]);

    ////
    // Construct tokens
    ////
    useEffect(() => {
        let tokensWithPrice: Token[] = [];

        // Append native tokens and balances
        const baseTokensExtended = [...baseTokens].concat(SUPPORTED_NATIVE_TOKENS);

        const balancesExtended = balances ? [...balances].concat(nativeTokenBalances) : undefined;

        for (let i = 0; i < baseTokensExtended.length; i++) {
            const baseToken = baseTokensExtended[i];
            const price = getPrice(baseToken, prices);

            // TODO MERGE
            const balance = balancesExtended ? balancesExtended[i] : undefined;
            const balanceUsd =
                balance != undefined && price != undefined
                    ? Number(formatUnits(balance, baseToken.decimals)) * price
                    : undefined;

            tokensWithPrice.push({
                ...baseToken,
                priceUsd: price,
                balance: balance,
                balanceUsd: balanceUsd,
            });
        }
        setTokens(tokensWithPrice);
    }, [baseTokens, balances, prices, nativeTokenBalances]);

    return <TokenListContext.Provider value={{ tokens }}>{children}</TokenListContext.Provider>;
}
