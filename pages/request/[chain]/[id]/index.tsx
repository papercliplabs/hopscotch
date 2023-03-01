import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { useAccount, useEnsName, useSwitchNetwork } from "wagmi";

import { UseChain, useChain } from "@/hooks/useChain";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";
import { useRequest } from "@/hooks/useRequest";
import { useToken } from "@/hooks/useTokenList";
import { ExplorerLinkType, Length, LoadingStatus, Token } from "@/common/types";
import { useExactOutputSwap } from "@/hooks/useExactOutputSwap";
import { useApproveErc20ForSwap } from "@/hooks/useApproveTokenForSwap";
import { Avatar, AvatarBadge, Button, Fade, Flex, Link, Spinner, Text, Tooltip, useToast } from "@chakra-ui/react";
import { formatNumber, formatTokenAmount, openLink, shortAddress } from "@/common/utils";
import { EnsAvatar } from "@/components/EnsAvatar";
import { PrimaryCard } from "@/layouts/PrimaryCardGrid";
import Image from "next/image";
import { InfoIcon, LinkIcon } from "@chakra-ui/icons";
import { colors } from "@/theme/colors";
import TokenSelect from "@/components/TokenSelect";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import { useConnectModal } from "@papercliplabs/rainbowkit";
import ApproveTokenOverlay from "@/components/ApproveTokenOverlay";
import PendingSignatureOverlay from "@/components/PendingSignatureOverlay";
import PendingTransactionOverlay from "@/components/PendingTransactionOverlay";
import FailedTransactionOverlay from "@/components/FailedTransactionOverlay";
import FlowStepOverlay from "@/components/FlowStepOverlay";
import SuccessfulTransactionOverlay from "@/components/SuccessfulTransactionOverlay";

interface RequestFormProps {
    disabled: boolean;
    quoteLoading: boolean;
    chain?: UseChain;
    inputToken?: Token;
    inputTokenQuoteAmountHumanReadable?: string;
    inputTokenQuoteUsd?: string;
    outputToken?: Token;
    outputTokenAmountHumanReadable?: string;
    outputTokenAmountUsd?: string;
    setInputTokenCallback: (token: Token | undefined) => void;
    portalRef: any;
}

function RequestForm({
    disabled,
    quoteLoading,
    chain,
    inputToken,
    inputTokenQuoteAmountHumanReadable,
    inputTokenQuoteUsd,
    outputToken,
    outputTokenAmountHumanReadable,
    outputTokenAmountUsd,
    setInputTokenCallback,
    portalRef,
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
                    <Text textStyle="headline">
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
                            inputTokenQuoteAmountHumanReadable
                        )}
                    </Text>
                    <Text textStyle="bodyMd" variant="secondary">
                        ${inputTokenQuoteUsd}
                    </Text>
                </Flex>

                <Flex flexDirection="column" justifyContent="center">
                    <TokenSelect
                        portalRef={portalRef}
                        token={inputToken}
                        setToken={setInputTokenCallback}
                        isDisabled={disabled}
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
                                alt={chain?.name}
                                width="14px"
                                height="14px"
                                layout="fixed"
                                objectFit="contain"
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

interface RequestReviewProps {
    chain?: UseChain;
    inputToken?: Token;
    inputTokenQuoteAmountHumanReadable?: string;
    senderAddress?: string;
    outputToken?: Token;
    outputTokenAmountHumanReadable?: string;
    recipientAddress?: string;
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
    return <div>TODO</div>;
}

export default function RequestPage() {
    const [inputToken, setInputToken] = useState<Token | undefined>(undefined);
    const [isFeeTooltipOpen, setIsFeeTooltipOpen] = useState<boolean>(false);
    const [paymentFlowActive, setPaymentFlowActive] = useState<boolean>(false);

    const ref = useRef(null);
    const toast = useToast();

    const { query } = useRouter();
    const requestChainId = query.chain as string | undefined;
    const requestId = query.id as string | undefined;

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
    const path = `/request/${request?.chainId}/${request?.requestId}`;
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
    } = useExactOutputSwap(
        inputToken?.address,
        request?.recipientTokenAddress,
        request?.recipientTokenAmount,
        request?.recipientAddress
    );

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
        requiresApproval,
        openConnectModal,
        approve,
        executeSwap,
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

    if (!request) {
        return <div> Request not found</div>;
    }

    return (
        <Fade in delay={1}>
            <Flex direction="column" gap="12px" justifyContent="space-between" height="100%" alignItems="center">
                {isOwner && (
                    <Flex
                        width="100%"
                        backgroundColor="#E4F2FF"
                        color="primary"
                        borderRadius="md"
                        p={4}
                        flexDirection="row"
                        maxWidth="400px"
                        direction="row"
                        justifyContent="space-between"
                        align="center"
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
                            <Text as="span" variant="gradient">
                                <Link href={recipientAddressExplorerLink} isExternal>
                                    <Tooltip
                                        label={request?.recipientAddress}
                                        p={3}
                                        backgroundColor="textPrimary"
                                        hasArrow
                                    >
                                        {recipientEnsName ?? shortAddress(request?.recipientAddress, Length.MEDIUM)}
                                    </Tooltip>{" "}
                                </Link>
                            </Text>
                            requested {formattedOutputAmount} {requestToken?.symbol}
                        </Text>
                        <Text variant="secondary" textStyle="bodySm">
                            Choose the token you want to pay with and it will be converted to {requestToken?.symbol}{" "}
                            before sending.
                        </Text>
                    </Flex>
                </Flex>
                <PrimaryCard
                    ref={ref}
                    position="relative"
                    height="100%"
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection="column"
                    padding={4}
                    display={"flex"}
                >
                    <Flex direction="column" flexGrow={1} justifyContent="space-between" width="100%">
                        <Text textStyle="titleLg" align="center">
                            You Pay
                        </Text>

                        <RequestForm
                            disabled={false}
                            quoteLoading={quoteLoading}
                            chain={requestChain}
                            inputToken={inputToken}
                            inputTokenQuoteAmountHumanReadable={formattedQuoteAmount}
                            inputTokenQuoteUsd={inputTokenUsdAmount}
                            outputToken={requestToken}
                            outputTokenAmountHumanReadable={formattedOutputAmount}
                            outputTokenAmountUsd={requestTokenUsdAmount}
                            setInputTokenCallback={setInputToken}
                            portalRef={ref}
                        />

                        <Flex direction="column" pt="10px" gap="5px" mt={2}>
                            <Flex direction="row" justifyContent="space-between">
                                <Text textStyle="label" variant="secondary" fontWeight="bold">
                                    Swap Rate
                                </Text>
                                <Text fontSize="sm">
                                    {inputToken && requestToken ? (
                                        quoteLoading ? (
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
                                            <>
                                                1 {requestToken.symbol} = {swapRate} {inputToken.symbol}
                                            </>
                                        )
                                    ) : (
                                        "--"
                                    )}
                                </Text>
                            </Flex>

                            <Flex direction="row" justifyContent="space-between" alignItems="center">
                                <Flex direction="row" boxSizing="border-box">
                                    <Text textStyle="label" variant="secondary" fontWeight="bold">
                                        Hopscotch Fee
                                    </Text>
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
                                </Flex>

                                <Text fontSize="sm">Free</Text>
                            </Flex>

                            <Flex direction="row" justifyContent="space-between">
                                <Text textStyle="label" variant="secondary" fontWeight="bold">
                                    Network
                                </Text>
                                <Flex align="center">
                                    <Image
                                        src={requestChain?.iconUrlSync}
                                        alt={requestChain?.name}
                                        width={16}
                                        height={16}
                                        layout="fixed"
                                        objectFit="contain"
                                        className="rounded-full"
                                    />
                                    <Text fontSize="sm" pl="4px">
                                        {requestChain?.name}
                                    </Text>
                                </Flex>
                            </Flex>

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
                    </Flex>

                    <FlowStepOverlay
                        isOpen={paymentFlowActive}
                        backButtonCallback={() => setPaymentFlowActive(false)}
                        title="Review"
                        custom={
                            <ReviewRequest
                                chain={requestChain}
                                inputToken={inputToken}
                                inputTokenQuoteAmountHumanReadable={formattedQuoteAmount}
                                senderAddress={address}
                                outputToken={requestToken}
                                outputTokenAmountHumanReadable={formattedOutputAmount}
                                recipientAddress={request?.recipientAddress}
                            />
                        }
                        primaryButtonInfo={{ text: "Pay request", onClick: () => executeSwap() }}
                    />

                    <ApproveTokenOverlay
                        isOpen={paymentFlowActive && (requiresApproval ?? false)}
                        token={inputToken}
                        chain={requestChain}
                        approveCallback={approve}
                        backButtonCallback={() => setPaymentFlowActive(false)}
                    />

                    <PendingSignatureOverlay
                        abortSignatureCallback={abortPendingApproveWalletSignature}
                        isOpen={pendingApproveWalletSignature}
                        title={`Approve ${inputToken?.symbol}`}
                    />

                    <PendingTransactionOverlay
                        isOpen={approveTransation?.status == "pending"}
                        title={`Approve ${inputToken?.symbol}`}
                        transactionLink={approveTransactionExplorerLink}
                    />

                    <FailedTransactionOverlay
                        isOpen={approveTransation?.status == "failed"}
                        subtitle={`${inputToken?.symbol} approval failed!`}
                        transactionLink={approveTransactionExplorerLink}
                        actionButtonText="Try again"
                        actionButtonCallback={() => clearApproveTransaction()}
                    />

                    <PendingSignatureOverlay
                        abortSignatureCallback={abortPendingSwapWalletSignature}
                        isOpen={pendingSwapWalletSignature}
                    />

                    <PendingTransactionOverlay
                        isOpen={swapTransaction?.status == "pending"}
                        transactionLink={swapTransactionExplorerLink}
                    />

                    <FailedTransactionOverlay
                        isOpen={swapTransaction?.status == "failed"}
                        subtitle="Payment failed"
                        transactionLink={swapTransactionExplorerLink}
                        actionButtonText="Try again"
                        actionButtonCallback={() => clearSwapTransaction()}
                    />

                    <SuccessfulTransactionOverlay
                        isOpen={swapTransaction?.status == "confirmed" || request?.paid}
                        subtitle="Request paid!"
                        body="The request has been paid."
                        transactionLink={swapTransactionExplorerLink}
                        primaryButtonInfo={{ text: "Create request", onClick: () => openLink("../../", false) }}
                    />
                </PrimaryCard>
            </Flex>
        </Fade>
    );
}
