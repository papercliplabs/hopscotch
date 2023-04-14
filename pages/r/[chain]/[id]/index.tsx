import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useAccount, useEnsName } from "wagmi";

import { useChain } from "@/hooks/useChain";
import { useRequest } from "@/hooks/useRequest";
import { useToken } from "@/hooks/useTokenList";
import { ExplorerLinkType, Length, LoadingStatus, Token } from "@/common/types";
import { usePayRequest } from "@/hooks/usePayRequest";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { Box, Button, Flex, Link, Spinner, Text, Tooltip, useToast } from "@chakra-ui/react";
import { formatNumber, formatTokenAmount, openLink, shortAddress, stringToNumber } from "@/common/utils";
import { EnsAvatar } from "@/components/EnsAvatar";
import PrimaryCard from "@/layouts/PrimaryCard";
import Image from "next/image";
import { LinkIcon } from "@chakra-ui/icons";
import { colors } from "@/theme/colors";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import ApproveTokenView from "@/views/ApproveTokenView";
import { BigNumber } from "ethers";
import Head from "next/head";
import dynamic from "next/dynamic";
import SummaryTable from "@/components/SummaryTable";
import PayRequestForm from "@/components/PayRequestForm";
import Carousel from "@/components/Carousel";
import TransactionFlow from "@/components/TransactionFlow";
import ReviewPayRequest from "@/components/ReviewPayRequest";
import SuccessfulTransactionView from "@/views/SuccessfulTransactionView";

function PayRequest() {
    const [payToken, setPayToken] = useState<Token | undefined>(undefined);
    const [paymentFlowActive, setPaymentFlowActive] = useState<boolean>(false);

    const toast = useToast();
    const { address } = useAccount();

    // Get the request
    const { query } = useRouter();
    const [requestChainId, requestId] = useMemo(() => {
        let chainId = typeof query.chain === "string" ? stringToNumber(query.chain) : undefined;
        let requestId = typeof query.id === "string" ? BigNumber.from(query.id) : undefined;
        return [chainId, requestId];
    }, [query]);
    const request = useRequest(requestChainId, requestId);

    // Parse data from request
    const requestChain = useChain(request?.chainId);
    const requestToken = useToken(request?.recipientTokenAddress, request?.chainId);
    const { data: recipientEnsName } = useEnsName({
        address: request?.recipientAddress,
        chainId: 1,
    });
    const isOwner = address == request?.recipientAddress;

    // get url server side safe nextjs
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = `/r/${request?.chainId}/${request?.requestId}`;
    const requestLink = `${origin}${path}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(requestLink);

        // show toast notification
        toast({
            title: "Link copied!",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
    };

    const recipientAddressExplorerLink = useExplorerLink(
        request?.recipientAddress,
        ExplorerLinkType.WALLET_OR_CONTRACT,
        requestChain
    );

    const {
        swapQuote,
        transaction: swapTransaction,
        transactionExplorerLink: swapTransactionExplorerLink,
        pendingWalletSignature: pendingSwapWalletSignature,
        abortPendingSignature: abortPendingSwapWalletSignature,
        executeSwap,
        clearTransaction: clearSwapTransaction,
    } = usePayRequest(requestChain.id, request?.requestId, payToken?.address);

    const {
        requiresApproval,
        approve,
        transaction: approveTransation,
        transactionExplorerLink: approveTransactionExplorerLink,
        pendingWalletSignature: pendingApproveWalletSignature,
        abortPendingSignature: abortPendingApproveWalletSignature,
        clearTransaction: clearApproveTransaction,
    } = useApproveErc20ForSwap(payToken?.address, swapQuote.quoteAmount);

    // Derived

    const formattedQuoteAmount = formatTokenAmount(swapQuote?.quoteAmount, payToken?.decimals, 6);
    const formattedOutputAmount = formatTokenAmount(request?.recipientTokenAmount, requestToken?.decimals, 6);

    const activeViewIndex = useMemo(() => {
        if (paymentFlowActive) {
            if (requiresApproval) {
                // Need to approve
                if (approveTransation == undefined && !pendingApproveWalletSignature) {
                    return 1;
                } else {
                    return 2;
                }
            } else {
                // Already approved
                if (swapTransaction == undefined && !pendingSwapWalletSignature) {
                    return 3;
                } else {
                    return 4;
                }
            }
        } else {
            return 0;
        }
    }, [
        requiresApproval,
        paymentFlowActive,
        approveTransation,
        pendingApproveWalletSignature,
        swapTransaction,
        pendingSwapWalletSignature,
    ]);

    if (request == undefined) {
        return <div> Request not found</div>;
    }

    const humanReadableRecipientAddress = recipientEnsName ?? shortAddress(request?.recipientAddress, Length.MEDIUM);

    const paidSummary = (
        <Flex px={4} width="100%">
            <Box width="100%" py={2} borderBottom="2px" borderTop="2px" style={{ borderColor: colors.bgSecondary }}>
                <SummaryTable
                    rowGap="9px"
                    entries={[
                        {
                            title: "Value",
                            value: `${formattedOutputAmount} ${requestToken?.symbol}`,
                        },
                        // {
                        //     title: "From",
                        //     value: "Harder since if it was already paid we need to add a hook to make a request to figure out by whom it was",
                        // },
                        {
                            title: "To",
                            value: humanReadableRecipientAddress,
                        },
                        {
                            title: "Network",
                            value: requestChain?.name,
                            valueIcon: (
                                <Image
                                    src={requestChain?.iconUrlSync}
                                    alt={requestChain?.name}
                                    width={20}
                                    height={20}
                                />
                            ),
                        },
                    ]}
                />
            </Box>
        </Flex>
    );

    const paidView = (
        <SuccessfulTransactionView
            subtitle="Paid!"
            body=""
            transactionLink={swapTransactionExplorerLink}
            primaryButtonInfo={{
                text: "Create request",
                onClick: () => openLink("../../", false),
            }}
            compressButtons={true}
            custom={paidSummary}
        />
    );

    return (
        <Flex direction="column" gap="12px" justifyContent="space-between" height="100%" alignItems="center">
            {isOwner && (
                <Flex
                    width="100%"
                    backgroundColor="#E4F2FF"
                    color="primary"
                    borderRadius="md"
                    p={4}
                    flexDirection="row"
                    direction="row"
                    justifyContent="space-between"
                    align="center"
                    maxWidth="400px"
                >
                    <Flex direction="column">
                        <Text textStyle="titleSm">This is your payment request</Text>
                        <Text textStyle="bodySm">Share it with anyone</Text>
                    </Flex>

                    <Button variant="primary" size="sm" onClick={copyToClipboard} leftIcon={<LinkIcon />}>
                        Copy Link
                    </Button>
                </Flex>
            )}

            <Flex
                width="100%"
                backgroundColor="bgSecondary"
                borderRadius="md"
                p={4}
                flexDirection="row"
                justifyContent="space-between"
                align="center"
                maxWidth="400px"
            >
                <EnsAvatar address={request?.recipientAddress} width="32px" height="32px" fontSize="sm" />

                <Flex direction="column" ml={3}>
                    <Text textStyle="titleSm">
                        <Text as="span" color="primary">
                            <Link href={recipientAddressExplorerLink} isExternal>
                                <Tooltip label={request?.recipientAddress} p={3} backgroundColor="textPrimary" hasArrow>
                                    {humanReadableRecipientAddress}
                                </Tooltip>{" "}
                            </Link>
                        </Text>
                        requested {formattedOutputAmount} {requestToken?.symbol}
                    </Text>
                    <Text variant="secondary" textStyle="bodySm">
                        Choose the token you want to pay with and it will be converted to {requestToken?.symbol} before
                        sending.
                    </Text>
                </Flex>
            </Flex>
            <PrimaryCard>
                <Carousel
                    views={[
                        <>
                            {request?.paid ? (
                                paidView
                            ) : (
                                <PayRequestForm
                                    request={request}
                                    payToken={payToken}
                                    quoteStatus={swapQuote?.quoteStatus}
                                    payTokenQuoteAmount={swapQuote?.quoteAmount}
                                    setPayToken={setPayToken}
                                    submit={() => setPaymentFlowActive(true)}
                                    key={0}
                                />
                            )}
                        </>,
                        <ApproveTokenView
                            token={payToken}
                            chain={requestChain}
                            approveCallback={approve}
                            backButtonCallback={() => setPaymentFlowActive(false)}
                            key={1}
                        />,
                        <TransactionFlow
                            title={`Approve ${payToken?.symbol}`}
                            pendingWalletSignature={pendingApproveWalletSignature}
                            transaction={approveTransation}
                            transactionExplorerLink={approveTransactionExplorerLink}
                            abortSignatureCallback={abortPendingApproveWalletSignature}
                            retryFailedTransactionCallback={clearApproveTransaction}
                            key={2}
                        />,
                        <ReviewPayRequest
                            payToken={payToken}
                            payTokenAmount={swapQuote?.quoteAmount}
                            senderAddress={address}
                            requestToken={requestToken}
                            requestTokenAmount={request?.recipientTokenAmount}
                            recipientAddress={request?.recipientAddress}
                            chain={requestChain}
                            backButtonCallback={() => setPaymentFlowActive(false)}
                            payButtonCallback={executeSwap}
                            key={3}
                        />,
                        <TransactionFlow
                            title={`Pay request`}
                            pendingWalletSignature={pendingSwapWalletSignature}
                            transaction={swapTransaction}
                            transactionExplorerLink={swapTransactionExplorerLink}
                            successfulTransactionView={paidView}
                            abortSignatureCallback={abortPendingSwapWalletSignature}
                            retryFailedTransactionCallback={clearSwapTransaction}
                            key={4}
                        />,
                    ]}
                    activeViewIndex={activeViewIndex}
                />
            </PrimaryCard>
        </Flex>
    );
}

// Wrap CreateRequest with next/dynamic for client-side only rendering
const DynamicCreateRequest = dynamic(() => Promise.resolve(PayRequest), { ssr: false });

const RequestPage = () => {
    return (
        <>
            <Head>
                <meta property="og:title" content="Pay me on Hopscotch" />
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

export default RequestPage;
