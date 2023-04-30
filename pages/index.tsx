import { useEffect, useMemo, useState } from "react";
import { Text, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Address } from "wagmi";
import { ethers } from "ethers";

import { formatNumber, getDefaultLinearGradientForAddress, parseTokenAmount } from "@/common/utils";
import PrimaryCard from "@/layouts/PrimaryCard";
import { useChain } from "@/hooks/useChain";
import useCreateRequest from "@/hooks/transactions/useCreateRequest";
import CopyLinkView from "@/components/CopyLinkView";
import Head from "next/head";
import CreateRequestForm from "@/components/CreateRequestForm";
import TransactionFlow from "@/components/transactions/TransactionFlow";
import Carousel from "@/components/Carousel";
import { useToken } from "@/hooks/useTokenList";
import { fetchEnsAddress, fetchEnsAvatar } from "@wagmi/core";

enum CreateRequestView {
    InputForm = 0,
    Transaction = 1,
    CopyLink = 2,
}

function CreateRequest() {
    const [requestTokenAddress, setRequestTokenAddress] = useState<Address | undefined>(undefined);
    const [requestTokenAmountHumanReadable, setRequestTokenAmountHumanReadable] = useState<string | undefined>(
        undefined
    );

    const requestToken = useToken(requestTokenAddress);

    const requestTokenAmount = useMemo(() => {
        return requestTokenAmountHumanReadable && requestToken
            ? parseTokenAmount(requestTokenAmountHumanReadable, requestToken.decimals)
            : undefined;
    }, [requestTokenAmountHumanReadable, requestToken]);

    const createTransactionResponse = useCreateRequest(requestToken?.address, requestTokenAmount);
    const requestChain = useChain(createTransactionResponse.chainId);

    // Reset selected when chain changes
    const activeChain = useChain();
    useEffect(() => {
        setRequestTokenAddress(undefined);
    }, [activeChain.id]);

    const views = useMemo(() => {
        return [
            <CreateRequestForm
                requestToken={requestToken}
                requestTokenAmountHumanReadable={requestTokenAmountHumanReadable}
                setRequestTokenAddress={setRequestTokenAddress}
                setRequestTokenAmountHumanReadable={setRequestTokenAmountHumanReadable}
                submit={createTransactionResponse.send}
                key={0}
            />,
            <TransactionFlow
                title="Create request"
                transactionResponse={createTransactionResponse}
                successfulTransactionView={undefined} // Hold showing until we have request id
                key={1}
            />,
            <CopyLinkView
                requestSummary={`${formatNumber(requestTokenAmountHumanReadable, 6)} ${requestToken?.symbol} on ${
                    requestChain?.name
                }`}
                chainId={requestChain?.id}
                requestId={createTransactionResponse.requestId}
                transactionLink={createTransactionResponse.explorerLink}
                key={2}
            />,
        ];
    }, [
        requestToken,
        requestTokenAmountHumanReadable,
        setRequestTokenAddress,
        setRequestTokenAmountHumanReadable,
        createTransactionResponse,
        requestChain,
    ]);

    const viewIndex = useMemo(() => {
        if (createTransactionResponse.requestId) {
            return CreateRequestView.CopyLink;
        } else if (createTransactionResponse.hash != undefined || createTransactionResponse.pendingWalletSignature) {
            return CreateRequestView.Transaction;
        } else {
            return CreateRequestView.InputForm;
        }
    }, [createTransactionResponse]);

    useEffect(() => {
        async function t() {
            // const avatarUrl = await fetchEnsAvatar({
            //     address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
            //     chainId: 1,
            // });
            // console.log("FETCHED AVATAR URL", avatarUrl);

            // const provider = ethers.getDefaultProvider(ethers.providers.getNetwork(1));
            const address = "0x5303B22B50470478Aa1E989efaf1003e6B2A309c";

            // const ensName = await provider.lookupAddress(address);

            // const ensResolver = await provider.getResolver(ensName ?? "");
            // // You can fetch any key stored in their ENS profile.
            // const twitterHandle = await ensResolver?.getText("com.twitter");

            const provider = new ethers.providers.AlchemyProvider("mainnet", process.env.NEXT_PUBLIC_ALCHEMY_ID);
            const ensName = await provider.lookupAddress(address);
            const ensAvatarUrl = await provider.getAvatar(ensName ?? "");
            console.log("ENS", ensName, ensAvatarUrl);
        }

        t();
    }, []);

    return (
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between">
            <Flex direction="column" justifyContent="center" alignItems="center" pb={4}>
                <Text textStyle="headline">Create a request</Text>
                <Text textStyle="bodyLg" variant="secondary">
                    You{"'"}ll send this link to get paid.
                </Text>
            </Flex>
            <PrimaryCard>
                <Carousel views={views} activeViewIndex={viewIndex} />
            </PrimaryCard>
        </Flex>
    );
}

// Wrap CreateRequest with next/dynamic for client-side only rendering
const DynamicCreateRequest = dynamic(() => Promise.resolve(CreateRequest), { ssr: false });

const Index = () => {
    const g = getDefaultLinearGradientForAddress("0x5303B22B50470478Aa1E989efaf1003e6B2A309f");
    console.log("GRAD", g);
    return (
        <>
            <Head>
                <meta property="og:title" content="Get paid on Hopscotch" />
                <meta property="og:site_name" content="hopscotch.cash" />
                {/* <meta property="og:image" content={LoggedOut.sr} /> */}
            </Head>
            <DynamicCreateRequest />
        </>
    );
};

export async function getServerSideProps() {
    return { props: {} };
}

export default Index;
