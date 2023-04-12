import { useRouter } from "next/router";
import { ReactElement, useMemo, useRef, useState } from "react";
import { Address, useAccount, useEnsName, useSwitchNetwork } from "wagmi";

import { UseChain, useChain } from "@/hooks/useChain";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";
import { useRequest } from "@/hooks/useRequest";
import { useToken } from "@/hooks/useTokenList";
import { ExplorerLinkType, Length, LoadingStatus, Token } from "@/common/types";
import { usePayRequest } from "@/hooks/usePayRequest";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { Avatar, AvatarBadge, Box, Button, Flex, Link, Spinner, Text, Tooltip, useToast } from "@chakra-ui/react";
import { formatNumber, formatTokenAmount, openLink, shortAddress, stringToNumber } from "@/common/utils";
import { EnsAvatar } from "@/components/EnsAvatar";
import { PrimaryCard } from "@/layouts/PrimaryCardGrid";
import Image from "next/image";
import { InfoIcon, LinkIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { colors } from "@/theme/colors";
import TokenSelectView from "@/views/TokenSelectView";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import { useConnectModal } from "@papercliplabs/rainbowkit";
import ApproveTokenView from "@/views/ApproveTokenView";
import PendingSignatureView from "@/views/PendingSignatureView";
import PendingTransactionView from "@/views/PendingTransactionView";
import FailedTransactionView from "@/views/FailedTransactionView";
import FlowStepOverlay from "@/layouts/FlowStepOverlay";
import SuccessfulTransactionView from "@/views/SuccessfulTransactionView";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import longArrowDown from "@/public/static/LongArrowDown.svg";
import { BigNumber } from "ethers";
import Head from "next/head";
import dynamic from "next/dynamic";
import { queryByTestId } from "@storybook/testing-library";
import HowItWorksView from "@/views/HowItWorksView";
import { NO_AMOUNT_DISPLAY } from "@/common/constants";
import TokenSelectButton from "@/components/TokenSelectButton";
import SummaryTable from "@/components/SummaryTable";

interface RequestFormProps {
    quoteLoading: boolean;
    chain?: UseChain;
    inputToken?: Token;
    inputTokenQuoteAmountHumanReadable?: string;
    inputTokenQuoteUsd?: string;
    outputToken?: Token;
    outputTokenAmountHumanReadable?: string;
    outputTokenAmountUsd?: string;
    tokenSelectOnClickCallback: () => void;
}

function RequestForm({
    quoteLoading,
    chain,
    inputToken,
    inputTokenQuoteAmountHumanReadable,
    inputTokenQuoteUsd,
    outputToken,
    outputTokenAmountHumanReadable,
    outputTokenAmountUsd,
    tokenSelectOnClickCallback,
}: RequestFormProps) {
    return (
        <Flex direction="column" gap="3px">
            <Flex
                width="100%"
                backgroundColor="bgSecondary"
                borderTopRadius="md"
                paddingX={4}
                paddingY={6}
                flexDirection="row"
                justifyContent="space-between"
                mt="10px"
            >
                <Flex direction="column" flex="1">
                    {quoteLoading ? (
                        <Spinner
                            thickness="2px"
                            speed="0.65s"
                            emptyColor="bgPrimary"
                            style={{
                                borderTopColor: colors.bgPrimary,
                            }}
                            color="textInteractive"
                            size="sm"
                        />
                    ) : (
                        <Text
                            textStyle="headline"
                            variant={inputTokenQuoteAmountHumanReadable != NO_AMOUNT_DISPLAY ? "primary" : "secondary"}
                        >
                            {inputTokenQuoteAmountHumanReadable}
                        </Text>
                    )}
                    <Text textStyle="bodyMd" variant="secondary">
                        ${inputTokenQuoteUsd}
                    </Text>
                </Flex>

                <Flex flexDirection="column" justifyContent="center">
                    <TokenSelectButton
                        selectedToken={inputToken}
                        onClickCallback={() => tokenSelectOnClickCallback()}
                    />
                </Flex>
            </Flex>
            <Flex
                width="100%"
                backgroundColor="bgSecondary"
                borderBottomRadius="md"
                padding={4}
                flexDirection="row"
                justifyContent="space-between"
            >
                <Flex direction="column">
                    <Text textStyle="titleSm" variant="secondary">
                        They receive:
                    </Text>
                    <Text textStyle="headline">{outputTokenAmountHumanReadable}</Text>
                    <Text textStyle="bodyMd" variant="secondary">
                        ${outputTokenAmountUsd}
                    </Text>
                </Flex>
                <Flex align="center">
                    <Avatar height="32px" width="32px" mr={2} src={outputToken?.logoURI}>
                        <AvatarBadge borderWidth={2}>
                            <Image
                                src={chain?.iconUrlSync ?? ""}
                                alt={chain?.name ?? ""}
                                width={14}
                                height={14}
                                className="rounded-full"
                            />
                        </AvatarBadge>
                    </Avatar>
                    <Text textStyle="titleLg">{outputToken?.symbol}</Text>
                </Flex>
            </Flex>
        </Flex>
    );
}

interface ReviewRequestRowProps {
    leftIcon?: ReactElement;
    topEntry?: ReactElement;
    bottomText?: string;
    rightIcon?: ReactElement;
}

function ReviewRequestRow({ leftIcon, topEntry, bottomText, rightIcon }: ReviewRequestRowProps) {
    return (
        <Flex direction="row" justifyContent="space-between" align="center">
            <Flex gap="16px">
                {leftIcon}
                <Flex direction="column" justifyContent="space-between">
                    {topEntry}
                    <Text textStyle="titleLg">{bottomText}</Text>
                </Flex>
            </Flex>
            {rightIcon}
        </Flex>
    );
}

interface RequestReviewProps {
    chain?: UseChain;
    inputToken?: Token;
    inputTokenQuoteAmountHumanReadable?: string;
    senderAddress?: Address;
    outputToken?: Token;
    outputTokenAmountHumanReadable?: string;
    recipientAddress?: Address;
}

function ReviewRequest({
    chain,
    inputToken,
    inputTokenQuoteAmountHumanReadable,
    senderAddress,
    outputToken,
    outputTokenAmountHumanReadable,
    recipientAddress,
}: RequestReviewProps) {
    const recipientExplorerLink = useExplorerLink(recipientAddress, ExplorerLinkType.WALLET_OR_CONTRACT, chain);

    return (
        <Flex p="16px" border="2px solid #EFF0F3" borderRadius="16px" direction="column" gap="1px" width="100%">
            <ReviewRequestRow
                leftIcon={<EnsAvatar address={senderAddress} />}
                topEntry={
                    <Text textStyle="titleSm" variant="secondary">
                        You send
                    </Text>
                }
                bottomText={`${inputTokenQuoteAmountHumanReadable} ${inputToken?.symbol}`}
                rightIcon={<TokenWithChainIcon token={inputToken} chain={chain} size={32} />}
            />
            <Box pl="13px">
                <Image src={longArrowDown} alt="check" />
            </Box>
            <ReviewRequestRow
                leftIcon={<EnsAvatar address={recipientAddress} />}
                topEntry={
                    <>
                        <Text textStyle="titleSm" variant="gradient" display="inline">
                            <Link href={recipientExplorerLink} isExternal>
                                {shortAddress(recipientAddress, Length.MEDIUM)}
                            </Link>{" "}
                        </Text>
                        receives
                    </>
                }
                bottomText={`${outputTokenAmountHumanReadable} ${outputToken?.symbol}`}
                rightIcon={<TokenWithChainIcon token={outputToken} chain={chain} size={32} />}
            />
        </Flex>
    );
}

function PayRequest() {
    const [inputToken, setInputToken] = useState<Token | undefined>(undefined);
    const [isFeeTooltipOpen, setIsFeeTooltipOpen] = useState<boolean>(false);
    const [paymentFlowActive, setPaymentFlowActive] = useState<boolean>(false);

    const [HowItWorksViewOpen, setHowItWorksViewOpen] = useState<boolean>(false);
    const [tokenSelectOpen, setTokenSelectOpen] = useState<boolean>(false);

    const ref = useRef(null);
    const toast = useToast();

    const { query } = useRouter();
    const [requestChainId, requestId] = useMemo(() => {
        let chainId = typeof query.chain === "string" ? stringToNumber(query.chain) : undefined;
        let requestId = typeof query.id === "string" ? BigNumber.from(query.id) : undefined;
        return [chainId, requestId];
    }, [query]);

    const { address } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { switchNetwork } = useSwitchNetwork();

    // Get the request
    const request = useRequest(requestChainId, requestId);

    // Parse data from request
    const requestChain = useChain(request?.chainId);
    const requestToken = useToken(request?.recipientTokenAddress, request?.chainId);
    const { data: recipientEnsName } = useEnsName({
        address: request?.recipientAddress,
        chainId: 1,
    });
    const onExpectedChain = useIsOnExpectedChain(request?.chainId);
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
        pendingWalletSignature: pendingSwapWalletSignature,
        abortPendingSignature: abortPendingSwapWalletSignature,
        executeSwap,
        clearTransaction: clearSwapTransaction,
    } = usePayRequest(requestChain.id, request?.requestId, inputToken?.address);

    const {
        requiresApproval,
        approve,
        transaction: approveTransation,
        pendingWalletSignature: pendingApproveWalletSignature,
        abortPendingSignature: abortPendingApproveWalletSignature,
        clearTransaction: clearApproveTransaction,
    } = useApproveErc20ForSwap(inputToken?.address, swapQuote.quoteAmount);

    const hasSufficentFunds = useMemo(() => {
        let ret = false;

        if (inputToken && inputToken.balance && swapQuote.quoteAmount) {
            ret = inputToken.balance.gte(swapQuote.quoteAmount);
        }

        return ret;
    }, [inputToken, swapQuote.quoteAmount]);

    const approveTransactionExplorerLink = useExplorerLink(
        approveTransation?.hash,
        ExplorerLinkType.TRANSACTION,
        requestChain
    );

    const swapTransactionExplorerLink = useExplorerLink(
        swapTransaction?.hash,
        ExplorerLinkType.TRANSACTION,
        requestChain
    );

    // Compute the primary button state
    const { primaryButtonText, primaryButtonOnClickFunction, primaryButtonVariant } = useMemo(() => {
        if (!address) {
            return {
                primaryButtonText: "Connect wallet",
                primaryButtonOnClickFunction: openConnectModal,
                primaryButtonVariant: "secondary",
            };
        } else if (!onExpectedChain) {
            return {
                primaryButtonText: "Switch to " + requestChain?.name,
                primaryButtonOnClickFunction: () => (switchNetwork ? switchNetwork(request?.chainId) : null),
                primaryButtonVariant: "primary",
            };
        } else if (!inputToken) {
            return {
                primaryButtonText: "Choose token",
                primaryButtonOnClickFunction: undefined,
                primaryButtonVariant: "primary",
            };
        } else if (LoadingStatus.LOADING == swapQuote.quoteStatus) {
            return {
                primaryButtonText: "Fetching route",
                primaryButtonOnClickFunction: undefined,
                primaryButtonVariant: "primary",
            };
        } else if (LoadingStatus.ERROR == swapQuote.quoteStatus) {
            return {
                primaryButtonText: "Route not found",
                primaryButtonOnClickFunction: undefined,
                primaryButtonVariant: "primary",
            };
        } else if (!hasSufficentFunds) {
            return {
                primaryButtonText: "Insufficient funds",
                primaryButtonOnClickFunction: undefined,
                primaryButtonVariant: "primary",
            };
        } else {
            return {
                primaryButtonText: "Review Payment",
                primaryButtonOnClickFunction: () => setPaymentFlowActive(true),
                primaryButtonVariant: "primary",
            };
        }
    }, [
        request,
        inputToken,
        address,
        swapQuote,
        hasSufficentFunds,
        openConnectModal,
        onExpectedChain,
        requestChain,
        switchNetwork,
    ]);

    // Format numbers
    const formattedQuoteAmount = formatTokenAmount(swapQuote?.quoteAmount, inputToken?.decimals, 6);
    const inputTokenUsdAmount = formatNumber(Number(formattedQuoteAmount) * Number(inputToken?.priceUsd), 2, false);
    const formattedOutputAmount = formatTokenAmount(request?.recipientTokenAmount, requestToken?.decimals, 6);
    const requestTokenUsdAmount = formatNumber(
        Number(formattedOutputAmount) * Number(requestToken?.priceUsd),
        2,
        false
    );
    const swapRate = formatNumber(Number(formattedQuoteAmount) / Number(formattedOutputAmount));

    const quoteLoading = LoadingStatus.LOADING == swapQuote.quoteStatus;

    if (request == undefined) {
        return <div> Request not found</div>;
    }

    const quoteReady = inputToken && requestToken && !quoteLoading;
    const humanReadableRecipientAddress = recipientEnsName ?? shortAddress(request?.recipientAddress, Length.MEDIUM);

    const bottomSummary = (
        <SummaryTable
            entries={[
                {
                    title: "Swap Rate",
                    value: quoteReady
                        ? `1 ${requestToken.symbol} = ${swapRate} ${inputToken.symbol}`
                        : NO_AMOUNT_DISPLAY,
                    valueIcon: quoteLoading ? (
                        <Spinner
                            thickness="2px"
                            speed="0.65s"
                            emptyColor="bgPrimary"
                            style={{
                                borderTopColor: colors.bgPrimary,
                            }}
                            color="textInteractive"
                            size="sm"
                        />
                    ) : undefined,
                },
                {
                    title: "Hopscotch Fee",
                    titleIcon: (
                        <Tooltip
                            label="This app currently does not take a fee from transactions. In the future it may to help support development."
                            p={3}
                            boxSize="borderBox"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            hasArrow
                            backgroundColor="textPrimary"
                            isOpen={isFeeTooltipOpen}
                        >
                            <InfoIcon
                                boxSize="13px"
                                m="auto"
                                ml={1.5}
                                color="textSecondary"
                                onMouseEnter={() => setIsFeeTooltipOpen(true)}
                                onMouseLeave={() => setIsFeeTooltipOpen(false)}
                                onClick={() => setIsFeeTooltipOpen(true)}
                            />
                        </Tooltip>
                    ),
                    value: "Free",
                },
                {
                    title: "Network",
                    value: requestChain?.name,
                    valueIcon: (
                        <Image src={requestChain?.iconUrlSync} alt={requestChain?.name} width={20} height={20} />
                    ),
                },
            ]}
        />
    );

    const paidSummary = (
        <Flex px={8} width="100%">
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

    const payRequestBase = (
        <Flex direction="column" flexGrow={1} justifyContent="space-between" width="100%" height="100%">
            <Text textStyle="titleLg" align="center">
                You Pay
            </Text>
            <RequestForm
                quoteLoading={quoteLoading}
                chain={requestChain}
                inputToken={inputToken}
                inputTokenQuoteAmountHumanReadable={formattedQuoteAmount}
                inputTokenQuoteUsd={inputTokenUsdAmount}
                outputToken={requestToken}
                outputTokenAmountHumanReadable={formattedOutputAmount}
                outputTokenAmountUsd={requestTokenUsdAmount}
                tokenSelectOnClickCallback={() => setTokenSelectOpen(true)}
            />
            {bottomSummary}
            <Button
                variant={onExpectedChain ? primaryButtonVariant : "critical"}
                type="submit"
                width="100%"
                minHeight="48px"
                size="lg"
                onClick={() => {
                    primaryButtonOnClickFunction && primaryButtonOnClickFunction();
                }}
                isDisabled={primaryButtonOnClickFunction == undefined}
            >
                {primaryButtonText}
            </Button>
        </Flex>
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
            <PrimaryCard ref={ref}>
                <Button variant="ghost" onClick={() => setHowItWorksViewOpen(true)} p={0} position="absolute" left={2}>
                    <QuestionOutlineIcon boxSize="20px" />
                </Button>

                {payRequestBase}

                <HowItWorksView
                    isOpen={HowItWorksViewOpen}
                    closeCallback={() => setHowItWorksViewOpen(false)}
                    stepOneInfo={{
                        title: "Connect your wallet",
                        description: "Connect the wallet you want to pay the request with.",
                    }}
                    stepTwoInfo={{
                        title: "Pay with any token",
                        description: "Choose any available ERC20 token to pay with.",
                    }}
                    stepThreeInfo={{
                        title: "Send it",
                        description: "Hopscotch will swap and send the tokens in one transaction.",
                    }}
                />

                <TokenSelectView
                    isOpen={tokenSelectOpen}
                    closeCallback={() => setTokenSelectOpen(false)}
                    token={inputToken}
                    setToken={setInputToken}
                    customChain={requestChain}
                />

                <FlowStepOverlay
                    isOpen={paymentFlowActive}
                    backButtonCallback={() => setPaymentFlowActive(false)}
                    title="Review"
                    custom={
                        <>
                            <ReviewRequest
                                chain={requestChain}
                                inputToken={inputToken}
                                inputTokenQuoteAmountHumanReadable={formattedQuoteAmount}
                                senderAddress={address}
                                outputToken={requestToken}
                                outputTokenAmountHumanReadable={formattedOutputAmount}
                                recipientAddress={request?.recipientAddress}
                            />
                            {bottomSummary}
                        </>
                    }
                    primaryButtonInfo={{ text: "Pay request", onClick: executeSwap }}
                />

                <ApproveTokenView
                    isOpen={paymentFlowActive && (requiresApproval ?? false)}
                    token={inputToken}
                    chain={requestChain}
                    approveCallback={approve}
                    backButtonCallback={() => setPaymentFlowActive(false)}
                />

                <PendingSignatureView
                    abortSignatureCallback={abortPendingApproveWalletSignature}
                    isOpen={pendingApproveWalletSignature}
                    title={`Approve ${inputToken?.symbol}`}
                />

                <PendingTransactionView
                    isOpen={approveTransation?.status == "pending"}
                    title={`Approve ${inputToken?.symbol}`}
                    transactionLink={approveTransactionExplorerLink}
                />

                <FailedTransactionView
                    isOpen={approveTransation?.status == "failed"}
                    subtitle={`${inputToken?.symbol} approval failed!`}
                    transactionLink={approveTransactionExplorerLink}
                    actionButtonText="Try again"
                    actionButtonCallback={() => clearApproveTransaction()}
                />

                <PendingSignatureView
                    abortSignatureCallback={abortPendingSwapWalletSignature}
                    isOpen={pendingSwapWalletSignature}
                />

                <PendingTransactionView
                    isOpen={swapTransaction?.status == "pending"}
                    transactionLink={swapTransactionExplorerLink}
                />

                <FailedTransactionView
                    isOpen={swapTransaction?.status == "failed"}
                    subtitle="Payment failed"
                    transactionLink={swapTransactionExplorerLink}
                    actionButtonText="Try again"
                    actionButtonCallback={() => clearSwapTransaction()}
                />

                <SuccessfulTransactionView
                    isOpen={swapTransaction?.status == "confirmed" || request?.paid}
                    subtitle="Paid!"
                    body=""
                    transactionLink={swapTransactionExplorerLink}
                    primaryButtonInfo={{ text: "Create request", onClick: () => openLink("../../", false) }}
                    compressButtons={true}
                    custom={paidSummary}
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
