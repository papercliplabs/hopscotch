import { Box, Button, Heading, Text, Flex, Input, Select } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount, useBalance, useNetwork, useSignMessage } from "wagmi";
import router from "next/router";

import { SUPPORTED_TOKENS, TOKEN_INFO_LIST } from "@/common/constants";
import { SupportedToken } from "@/common/enums";
import {
    useInsertInvoiceMutation,
    useUpsertUserMutation,
    useGetUsersQuery,
    Invoices_Insert_Input,
} from "@/graphql/generated/graphql";

export default function CreateRequest() {
    const [{ data: account, loading, error }, disconnect] = useAccount();
    const [{ data }, signMessage] = useSignMessage({
        message: "Message signature verification",
    });
    const [{ data: network }, switchNetwork] = useNetwork();

    const [insertInvoice] = useInsertInvoiceMutation();
    const [upsertUser] = useUpsertUserMutation();

    const [selectedToken, setSelectedToken] = useState<SupportedToken>(SupportedToken.USDC);
    const [tokenAmountScaled, setTokenAmountScaled] = useState<string>("0");

    async function createRequest() {
        const { data: signature, error } = await signMessage();
        const chainId = network.chain?.id;

        console.log(error);

        if (signature && account && chainId) {
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

                    // Add invoice to database
                    if (recipientUser) {
                        return insertInvoice({
                            variables: {
                                object: {
                                    recipient_id: recipientUser.id,
                                    chain_id: chainId,
                                    recipient_token_address: TOKEN_INFO_LIST[selectedToken].address,
                                    recipient_token_amount_raw: tokenAmountScaled,
                                    status: "OPEN",
                                },
                            },
                        });
                    } else {
                        return Promise.reject("Error upserting user");
                    }
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
                    <Select onChange={(e) => setSelectedToken(e.target.value as SupportedToken)} value={selectedToken}>
                        {SUPPORTED_TOKENS.map((token) => {
                            const tokenInfo = TOKEN_INFO_LIST[token];
                            return <option value={token}>{tokenInfo.symbol}</option>;
                        })}
                    </Select>
                </Flex>
                {account ? <Button onClick={createRequest}>Create request</Button> : <ConnectButton />}
            </Flex>
        </>
    );
}
