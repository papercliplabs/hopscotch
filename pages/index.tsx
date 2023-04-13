import { useMemo, useState } from "react";
import { Text, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";

import { ExplorerLinkType, Token } from "@/common/types";
import { parseTokenAmount } from "@/common/utils";
import PrimaryCard from "@/layouts/PrimaryCard";
import { useChain } from "@/hooks/useChain";
import { useCreateRequest } from "@/hooks/useCreateRequest";
import CopyLinkView from "@/views/CopyLinkView";
import Head from "next/head";
import CreateRequestForm from "@/components/CreateRequestForm";
import TransactionFlow from "@/components/TransactionFlow";
import Carousel from "@/components/Carousel";

function CreateRequest() {
    const [requestToken, setRequestToken] = useState<Token | undefined>(undefined);
    const [requestTokenAmountHumanReadable, setRequestTokenAmountHumanReadable] = useState<string | undefined>(
        undefined
    );

    const requestTokenAmount = useMemo(() => {
        console.log(requestTokenAmountHumanReadable);
        return requestTokenAmountHumanReadable && requestToken
            ? parseTokenAmount(requestTokenAmountHumanReadable, requestToken.decimals)
            : undefined;
    }, [requestTokenAmountHumanReadable, requestToken]);

    const {
        createRequest,
        requestId,
        transactionExplorerLink,
        transaction,
        pendingWalletSignature,
        abortPendingSignature,
        clearTransaction,
    } = useCreateRequest(requestToken?.address, requestTokenAmount);

    const activeChain = useChain();

    const viewIndex = useMemo(() => {
        if (requestId) {
            return 2;
        } else if (transaction != undefined || pendingWalletSignature) {
            return 1;
        } else {
            return 0;
        }
    }, [transaction, pendingWalletSignature, requestId]);

    return (
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mt={4}>
            <Text textStyle="headline">Send a request.</Text>
            <Text textStyle="headline" variant="gradient" mb={6}>
                Get paid in any token.
            </Text>
            <PrimaryCard>
                <Carousel
                    views={[
                        <CreateRequestForm
                            requestToken={requestToken}
                            requestTokenAmountHumanReadable={requestTokenAmountHumanReadable}
                            setRequestToken={setRequestToken}
                            setRequestTokenAmountHumanReadable={setRequestTokenAmountHumanReadable}
                            submit={createRequest}
                            key={0}
                        />,
                        <TransactionFlow
                            title="Create request"
                            pendingWalletSignature={pendingWalletSignature}
                            transaction={transaction}
                            transactionExplorerLink={transactionExplorerLink}
                            successfulTransactionView={undefined} // Hold showing until we have request id
                            abortSignatureCallback={abortPendingSignature}
                            retryFailedTransactionCallback={clearTransaction}
                            key={1}
                        />,
                        <CopyLinkView
                            requestSummary={`${requestTokenAmountHumanReadable} ${requestToken?.symbol} on ${activeChain?.name}`}
                            chainId={activeChain?.id}
                            requestId={requestId}
                            transactionLink={transactionExplorerLink}
                            key={2}
                        />,
                    ]}
                    activeViewIndex={viewIndex}
                />
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
                <meta property="og:image" content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/og`} />
            </Head>
            <DynamicCreateRequest />
        </>
    );
};

export async function getServerSideProps() {
    return { props: {} };
}

export default Index;
