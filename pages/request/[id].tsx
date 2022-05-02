import { useRouter } from "next/router";

import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useNetwork } from "wagmi";

import { useGetInvoiceQuery, useGetUsersQuery } from "@/graphql/generated/graphql";
import { useState } from "react";
import { SupportedChainId } from "@/common/enums";
import TokenSelector from "@/components/TokenSelector";
import { useTokenList } from "@/common/hooks";
import { ethers } from "ethers";
import ConnectWalletIfNotConnectedButton from "@/components/ConnectWalletIfNotConnectedButton";
import { Token } from "@/common/types";

export default function RequestPage() {
    const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);

    const { query } = useRouter();
    const id = query.id;

    const { data: invoiceQueryResponse, loading, error } = useGetInvoiceQuery({ variables: { id }, skip: !id });

    const invoiceData = invoiceQueryResponse?.invoices_by_pk;

    const [{ data: network }, switchNetwork] = useNetwork();

    const chainId = (network.chain?.id as SupportedChainId) ?? SupportedChainId.MAINNET;

    const requestedChainId = invoiceData?.chain_id as SupportedChainId;
    const tokenList = useTokenList(requestedChainId);

    if (!invoiceData) {
        return "Invaid invoice data";
    }

    const recipientUserAddress = invoiceData.recipient_user.address;
    const recipientTokenAmountRaw = invoiceData.recipient_token_amount_raw;
    const status = invoiceData.status;
    const recipientTokenAddress = invoiceData.recipient_token_address;

    const requestedToken = tokenList.find((token) => token.address == recipientTokenAddress);

    console.log(requestedToken);
    console.log(requestedChainId);

    if (!requestedToken) {
        return "Can't find requested token";
    }

    const wrongNetwork = chainId != requestedChainId;

    return (
        <Container width="100%" height="100vh" maxW="832px">
            <Flex direction="column">
                <Heading size="md" mb={1}>
                    {recipientUserAddress}
                </Heading>
                <Text size="2xl" mb={4}>
                    Requested {ethers.utils.formatUnits(recipientTokenAmountRaw, requestedToken.decimals)}{" "}
                    {requestedToken.symbol}
                </Text>
                <Text size="2xl" mb={4}>
                    On chainId: {requestedChainId}
                </Text>
                <TokenSelector chainId={chainId} selectedTokenCallback={setSelectedToken} />
                <ConnectWalletIfNotConnectedButton
                    textIfConnected={wrongNetwork ? "Switch network" : "Pay"}
                    isDisabledIfConnected={
                        (wrongNetwork && !switchNetwork) || (!wrongNetwork && selectedToken == undefined)
                    }
                    onClickIfconnectedCallback={
                        wrongNetwork
                            ? switchNetwork
                                ? () => switchNetwork(requestedChainId)
                                : () => console.log("change in wallet")
                            : () => console.log("CLICKED")
                    }
                />

                <Text size="sm" color="gray.500">
                    Powered by 1inch
                </Text>
            </Flex>
        </Container>
    );
}
