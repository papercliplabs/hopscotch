import { useMemo, useState } from "react";
import { useAccount, Address } from "wagmi";

import { useChain } from "@/hooks/useChain";
import { fetchRequest, Request } from "@/hooks/useRequest";
import { useToken } from "@/hooks/useTokenList";
import { Length } from "@/common/types";
import usePayRequest from "@/hooks/transactions/usePayRequest";
import useApproveErc20 from "@/hooks/transactions/useApproveErc20";
import { Box, Button, Flex, Link, Text, Tooltip, useToast } from "@chakra-ui/react";
import { formatTokenAmount, openLink, parseJsonWithBigNumber, shortAddress, stringToNumber } from "@/common/utils";
import { WalletAvatar } from "@/components/WalletAvatar";
import PrimaryCard from "@/layouts/PrimaryCard";
import Image from "next/image";
import { LinkIcon } from "@chakra-ui/icons";
import { colors } from "@/theme/colors";
import { ExplorerLinkType, useExplorerLink } from "@/hooks/useExplorerLink";
import ApproveTokenView from "@/components/ApproveTokenView";
import { BigNumber } from "ethers";
import Head from "next/head";
import SummaryTable from "@/components/SummaryTable";
import PayRequestForm from "@/components/PayRequestForm";
import Carousel from "@/components/Carousel";
import TransactionFlow from "@/components/transactions/TransactionFlow";
import ReviewPayRequest from "@/components/ReviewPayRequest";
import SuccessfulTransactionView from "@/components/transactions/SuccessfulTransactionView";
import Spinner from "@/components/Spinner";
import Toast from "@/components/Toast";
import { fetchEnsInfo, getDefaultLinearGradientForAddress, useEnsInfoOrDefaults } from "@/hooks/useEnsInfoOrDefaults";
import WarningDisclaimer from "@/components/WarningDisclaimer";

function PayRequest({ request }: { request: Request }) {
    const [payTokenAddress, setPayTokenAddress] = useState<Address | undefined>(undefined);
    const [paymentFlowActive, setPaymentFlowActive] = useState<boolean>(false);

    const toast = useToast();
    const { address } = useAccount();

    // Parse data from request
    const requestChain = useChain(request?.chainId);

    const payToken = useToken(payTokenAddress, requestChain.id);

    const requestToken = useToken(request?.recipientTokenAddress, request?.chainId);
    const { name: recipientEnsName } = useEnsInfoOrDefaults(request?.recipientAddress);
    const isOwner = address == request?.recipientAddress;

    // get url server side safe nextjs
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = `/r/${request?.chainId}/${request?.requestId}`;
    const requestLink = `${origin}${path}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(requestLink);

        // show toast notification
        toast({
            duration: 5000,
            position: "bottom",
            render: () => <Toast msg="Link Copied!" />,
        });
    };

    const recipientAddressExplorerLink = useExplorerLink(
        request?.recipientAddress,
        ExplorerLinkType.WALLET_OR_CONTRACT,
        requestChain
    );

    const payRequestResponse = usePayRequest(requestChain.id, request?.requestId, payToken?.address);

    const approveTransactionResponse = useApproveErc20(payToken?.address, payRequestResponse.swapQuote.quoteAmount);

    // Derived

    const formattedQuoteAmount = formatTokenAmount(payRequestResponse.swapQuote?.quoteAmount, payToken?.decimals, 6);
    const formattedOutputAmount = formatTokenAmount(request?.recipientTokenAmount, requestToken?.decimals, 6);

    const activeViewIndex = useMemo(() => {
        if (paymentFlowActive) {
            if (approveTransactionResponse.requiresApproval) {
                // Need to approve
                if (
                    approveTransactionResponse.hash == undefined &&
                    !approveTransactionResponse?.pendingWalletSignature
                ) {
                    return 1;
                } else {
                    return 2;
                }
            } else {
                // Already approved
                if (payRequestResponse.hash == undefined && !payRequestResponse.pendingWalletSignature) {
                    return 3;
                } else {
                    return 4;
                }
            }
        } else {
            return 0;
        }
    }, [approveTransactionResponse, paymentFlowActive, payRequestResponse]);

    if (request == undefined) {
        return (
            <Flex width="100%" direction="column" alignItems="center" justifyContent="center" pt="200px">
                <Spinner size="120px" />
            </Flex>
        );
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
                                <Image src={requestChain?.iconUri} alt={requestChain?.name} width={16} height={16} />
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
            transactionLink={payRequestResponse.explorerLink}
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
                align="top"
                maxWidth="400px"
            >
                <WalletAvatar address={request?.recipientAddress} size={32} />

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
                                    quoteStatus={payRequestResponse.swapQuote?.quoteStatus}
                                    payTokenQuoteAmount={payRequestResponse.swapQuote?.quoteAmount}
                                    setPayTokenAddress={setPayTokenAddress}
                                    submit={() => setPaymentFlowActive(true)}
                                    key={0}
                                />
                            )}
                        </>,
                        <ApproveTokenView
                            token={payToken}
                            chain={requestChain}
                            approveCallback={approveTransactionResponse.send}
                            backButtonCallback={() => setPaymentFlowActive(false)}
                            key={1}
                        />,
                        <TransactionFlow
                            title={`Approve ${payToken?.symbol}`}
                            transactionResponse={approveTransactionResponse}
                            key={2}
                        />,
                        <ReviewPayRequest
                            payToken={payToken}
                            payTokenAmount={payRequestResponse.swapQuote?.quoteAmount}
                            senderAddress={address}
                            requestToken={requestToken}
                            requestTokenAmount={request?.recipientTokenAmount}
                            recipientAddress={request?.recipientAddress}
                            chain={requestChain}
                            backButtonCallback={() => setPaymentFlowActive(false)}
                            payButtonCallback={payRequestResponse.send}
                            key={3}
                        />,
                        <TransactionFlow
                            title={`Pay request`}
                            transactionResponse={payRequestResponse}
                            successfulTransactionView={paidView}
                            key={4}
                        />,
                    ]}
                    activeViewIndex={activeViewIndex}
                />
            </PrimaryCard>
            <WarningDisclaimer />
        </Flex>
    );
}

interface RequestPageProps {
    requestJsonObject: Object;
    walletName: string;
    walletBackgroundImg: string;
}

export default function RequestPage({ requestJsonObject, walletName, walletBackgroundImg }: RequestPageProps) {
    const ogImgTitle = "Pay me on Hopscotch";
    const ogImgName = "hopscotch.cash";
    const ogImgContent = `http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/og?name=${encodeURIComponent(
        walletName
    )}&background=${encodeURIComponent(walletBackgroundImg)}`;

    // Parse data so we have correct BigNumber types
    const request = JSON.parse(JSON.stringify(requestJsonObject), parseJsonWithBigNumber) as Request;

    return (
        <>
            <Head>
                <title>Hopscotch</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff"></meta>

                <meta property="og:title" content={ogImgTitle} />
                <meta property="og:site_name" content={ogImgName} />
                <meta property="og:image" content={ogImgContent} />

                <meta name="twitter:title" content={ogImgTitle} />
                <meta property="twitter:image" content={ogImgContent} />
            </Head>
            <PayRequest request={request} />
        </>
    );
}

export async function getServerSideProps(context: any) {
    const requestChainId = stringToNumber(context.query?.chain);
    const requestId = BigNumber.from(context.query?.id ?? "0");
    const request = await fetchRequest(requestId, requestChainId);

    const { name: ensName, backgroundImg: ensBackgroundImg } = await fetchEnsInfo(request?.recipientAddress);

    return {
        props: {
            requestJsonObject: JSON.parse(JSON.stringify(request)),
            walletName: ensName ?? shortAddress(request?.recipientAddress, Length.MEDIUM),
            walletBackgroundImg: ensBackgroundImg ?? getDefaultLinearGradientForAddress(request?.recipientAddress),
        },
    };
}
