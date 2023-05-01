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
