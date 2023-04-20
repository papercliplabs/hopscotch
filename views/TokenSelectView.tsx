import { useEffect, useMemo, useState } from "react";
import { CloseButton, Flex, Grid, GridItem, Input, InputGroup, InputLeftElement, Stack, Text } from "@chakra-ui/react";

import { Token } from "@/common/types";
import { useTokenList } from "@/hooks/useTokenList";
import { SearchIcon } from "@chakra-ui/icons";
import { NetworkSelect } from "@/components/NetworkSelect";
import { formatNumber, formatTokenAmount } from "@/common/utils";
import { UseChain, useChain } from "@/hooks/useChain";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import { NO_AMOUNT_DISPLAY } from "@/common/constants";
import PrimaryCardView from "@/layouts/PrimaryCardView";

interface TokenSelectViewProps {
    closeCallback: () => void;
    token?: Token;
    setToken: (token: Token | undefined) => void;
    customChain?: UseChain;
}

export default function TokenSelectView({ closeCallback, token, setToken, customChain }: TokenSelectViewProps) {
    const [search, setSearch] = useState("");

    const handleSearchChange = (event: any) => setSearch(event?.target?.value);
    const activeChain = useChain();

    const chain = useMemo(() => {
        return customChain ?? activeChain;
    }, [customChain, activeChain]);

    const tokenList = useTokenList(chain.id);
    const filteredTokenList = useMemo(() => {
        let filteredTokenList = tokenList.filter((token) => token.symbol.toLowerCase().includes(search.toLowerCase()));
        filteredTokenList.sort((a, b) => {
            if (a?.balance != undefined && b.balance != undefined) {
                return a.balance.gt(b.balance) ? -1 : 1;
            } else {
                return 0;
            }
        });

        return filteredTokenList;
    }, [tokenList, search]);

    const buttonItems = useMemo(() => {
        return filteredTokenList.map((tokenDetails, index) => {
            const { name, address, symbol, balance, balanceUsd, decimals, logoURI } = tokenDetails;
            const isSelected = address === token?.address;
            return (
                <Flex
                    key={address}
                    flexDirection="row"
                    alignItems="center"
                    boxSizing="border-box"
                    justifyContent="space-between"
                    width="100%"
                    cursor="pointer"
                    paddingY={2}
                    paddingX={2}
                    borderRadius="xs"
                    backgroundColor={isSelected ? "blackAlpha.50" : "transparent"}
                    _hover={{
                        backgroundColor: "blackAlpha.50",
                    }}
                    onClick={() => {
                        setToken(tokenDetails);
                        closeCallback();
                    }}
                >
                    <Flex align="center">
                        <TokenWithChainIcon token={tokenDetails} chain={chain} size={32} mr={4} />
                        <Text textStyle="titleMd">{name}</Text>
                    </Flex>
                    <Flex direction="column" align="end">
                        <Text textStyle="bodyLg">
                            {balance ? formatTokenAmount(balance, decimals, 4) : NO_AMOUNT_DISPLAY} {symbol}
                        </Text>
                        <Text textStyle="bodyMd" variant="secondary">
                            {balanceUsd != undefined ? "$" + formatNumber(balanceUsd, 2) : NO_AMOUNT_DISPLAY}
                        </Text>
                    </Flex>
                </Flex>
            );
        });
    }, [filteredTokenList, setToken, closeCallback, chain, token]);

    return (
        <PrimaryCardView>
            <Flex position="relative" flexDirection="row" justifyContent="center" alignItems="center" mb={4}>
                <Text textStyle="titleLg" align="center">
                    Choose Token
                </Text>
                <CloseButton onClick={() => closeCallback()} position="absolute" right="0" height="40px" width="40px" />
            </Flex>
            <Grid
                templateRows="auto auto minmax(0, 1fr)"
                rowGap={2}
                width="100%"
                height="calc(100% - 40px)"
                templateColumns="1fr"
            >
                <GridItem>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="black" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search token"
                            value={search}
                            onChange={handleSearchChange}
                            borderRadius="full"
                            backgroundColor="bgSecondary"
                            color="grey"
                            textStyle="titleSm"
                            fontSize="lg"
                            lineHeight="120%"
                            letterSpacing="0"
                        />
                    </InputGroup>
                </GridItem>
                <GridItem>{customChain == undefined && <NetworkSelect />}</GridItem>
                <GridItem
                    flexDirection="column"
                    borderRadius="lg"
                    backgroundColor="bgSecondary"
                    paddingY={2}
                    overflowY="scroll"
                    sx={{
                        scrollbarWidth: "none",
                    }}
                >
                    {buttonItems.length === 0 ? (
                        <Text textStyle="titleSm" variant="primary" textAlign="center" mt={4}>
                            No results found.
                        </Text>
                    ) : (
                        <Stack width="100%" padding={2}>
                            {buttonItems}
                        </Stack>
                    )}
                </GridItem>
            </Grid>
        </PrimaryCardView>
    );
}
