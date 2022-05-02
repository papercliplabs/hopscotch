import { Box, Button, Heading, Text, Flex, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useBalance, useNetwork, useSignMessage } from "wagmi";
import router from "next/router";
import { Image } from "@chakra-ui/react";

import { SupportedChainId, SupportedToken } from "@/common/enums";
import { useInsertInvoiceMutation, useUpsertUserMutation } from "@/graphql/generated/graphql";
import { ethers, BigNumber } from "ethers";
import { chain } from "lodash";
import { Token } from "@/common/types";
import TokenSelector from "@/components/TokenSelector";
import ConnectWalletIfNotConnectedButton from "@/components/ConnectWalletIfNotConnectedButton";

export default function CreateRequest() {
    const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
    const [tokenAmountScaled, setTokenAmountScaled] = useState<string>("0");

    const [{ data: account }, disconnect] = useAccount();
    const [{ data }, signMessage] = useSignMessage({
        message: "Message signature verification",
    });
    const [{ data: network }] = useNetwork();

    const [insertInvoice] = useInsertInvoiceMutation();
    const [upsertUser] = useUpsertUserMutation();

    const chainId = (network.chain?.id as SupportedChainId) ?? SupportedChainId.MAINNET;

    async function createRequest() {
        const { data: signature, error } = await signMessage();

        console.log(error);

        if (signature && account && selectedToken) {
            const receipientAddress = account.address;
            console.log("CREATE REQUEST");
            console.log(
                `Receipient address: ${receipientAddress}, receipient token: ${selectedToken}, token amount scaled: ${tokenAmountScaled}`
            );

            // Add user to database if they don't exist
            upsertUser({
                variables: { address: receipientAddress },
            })
                .then(({ data }) => {
                    const recipientUser = data?.insert_users_one;
                    const tokenAmountRaw = ethers.utils.parseUnits(tokenAmountScaled, selectedToken.decimals);

                    // Add invoice to database
                    if (recipientUser) {
                        return insertInvoice({
                            variables: {
                                object: {
                                    recipient_id: recipientUser.id,
                                    chain_id: chainId,
                                    recipient_token_address: selectedToken.address,
                                    recipient_token_amount_raw: tokenAmountRaw.toString(),
                                    status: "OPEN",
                                },
                            },
                        });
                    } else {
                        return Promise.reject("Error upserting user");
                    }
                    BigInt;
                })
                .then(({ data }) => {
                    console.log("insertInvoiceResponse", data);
                    const invoiceId = data?.insert_invoices_one?.id;
                    router.push(`/request/${invoiceId}`);
                });
        }
    }

    return (
        <>
            <Flex direction="column" align="center">
                <Box>
                    <Heading>Create your request</Heading>
                </Box>
                <Box>
                    <Text>Get a link you can send anyone to pay you</Text>
                </Box>
                <Flex direction="row">
                    <Input onChange={(e) => setTokenAmountScaled(e.target.value)} value={tokenAmountScaled} />
                    <TokenSelector chainId={chainId} selectedTokenCallback={setSelectedToken} />
                </Flex>
                <ConnectWalletIfNotConnectedButton
                    textIfConnected="Create request"
                    isDisabledIfConnected={selectedToken == undefined}
                    onClickIfconnectedCallback={createRequest}
                />
            </Flex>
        </>
    );
}
