import { useMemo, useState } from "react";
import { useAccount, useSwitchNetwork } from "wagmi";
import { BigNumber } from "@ethersproject/bignumber";
import { useConnectModal } from "@papercliplabs/rainbowkit";
import { Avatar, AvatarBadge, Button, Flex, Slide, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { InfoIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import Image from "next/image";

import { LoadingStatus, Token } from "@/common/types";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";
import { Request } from "@/hooks/useRequest";
import PrimaryCardView from "@/layouts/PrimaryCardView";
import { useChain } from "@/hooks/useChain";
import { colors } from "@/theme/colors";
import { useToken } from "@/hooks/useTokenList";
import TokenSelectButton from "./TokenSelectButton";
import { formatNumber, formatTokenAmount } from "@/common/utils";
import { NO_AMOUNT_DISPLAY } from "@/common/constants";
import HowItWorksView from "@/views/HowItWorksView";
import TokenSelectView from "@/views/TokenSelectView";
import SummaryTable from "./SummaryTable";

interface PayRequestFormProps {
    request?: Request;
    payToken?: Token;
    quoteStatus?: LoadingStatus;
    payTokenQuoteAmount?: BigNumber;
    setPayToken: (token?: Token) => void;
    submit: () => void;
}

export default function PayRequestForm({
    request,
    payToken,
    quoteStatus,
    payTokenQuoteAmount,
    setPayToken,
    submit,
}: PayRequestFormProps) {
    const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
    const [tokenSelectOpen, setTokenSelectOpen] = useState<boolean>(false);
    const [isFeeTooltipOpen, setIsFeeTooltipOpen] = useState<boolean>(false);

    const { openConnectModal } = useConnectModal();
    const { switchNetwork } = useSwitchNetwork();

    const { address } = useAccount();
    const requestChain = useChain(request?.chainId);
    const onExpectedChain = useIsOnExpectedChain(request?.chainId);

    const requestToken = useToken(request?.recipientTokenAddress);

    const hasSufficentFunds = useMemo(() => {
        let ret = false;

        if (payToken && payToken.balance && payTokenQuoteAmount) {
            ret = payToken.balance.gte(payTokenQuoteAmount);
        }

        return ret;
    }, [payToken, payTokenQuoteAmount]);

    const [
        payTokenAmountHumanReadable,
        payTokenAmountHumanReadableUsd,
        requestTokenAmountHumanReadable,
        requestTokenAmountHumanReadableUsd,
    ] = useMemo(() => {
        const payTokenAmountHumanReadable = formatTokenAmount(payTokenQuoteAmount, payToken?.decimals, 6);
        const requestTokenAmountHumanReadable = formatTokenAmount(
            request?.recipientTokenAmount,
            requestToken?.decimals,
            6
        );
        const payTokenAmountHumanReadableUsd =
            payToken?.priceUsd && payTokenAmountHumanReadable != NO_AMOUNT_DISPLAY
                ? (payToken.priceUsd * parseFloat(payTokenAmountHumanReadable)).toFixed(6)
                : NO_AMOUNT_DISPLAY;
        const requestTokenAmountHumanReadableUsd =
            requestToken?.priceUsd && requestTokenAmountHumanReadable != NO_AMOUNT_DISPLAY
                ? (requestToken.priceUsd * parseFloat(requestTokenAmountHumanReadable)).toFixed(6)
                : NO_AMOUNT_DISPLAY;

        return [
            payTokenAmountHumanReadable,
            payTokenAmountHumanReadableUsd,
            requestTokenAmountHumanReadable,
            requestTokenAmountHumanReadableUsd,
        ];
    }, [payTokenQuoteAmount, payToken, requestToken, request]);

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
        } else if (!payToken) {
            return {
                primaryButtonText: "Choose token",
                primaryButtonOnClickFunction: undefined,
                primaryButtonVariant: "primary",
            };
        } else if (LoadingStatus.LOADING == quoteStatus) {
            return {
                primaryButtonText: "Fetching route",
                primaryButtonOnClickFunction: undefined,
                primaryButtonVariant: "primary",
            };
        } else if (LoadingStatus.ERROR == quoteStatus) {
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
                primaryButtonOnClickFunction: () => submit(),
                primaryButtonVariant: "primary",
            };
        }
    }, [
        request,
        payToken,
        address,
        quoteStatus,
        hasSufficentFunds,
        openConnectModal,
        onExpectedChain,
        requestChain,
        switchNetwork,
        submit,
    ]);

    const swapRate = formatNumber(Number(payTokenAmountHumanReadable) / Number(requestTokenAmountHumanReadable));

    return (
        <>
            <PrimaryCardView>
                <Button variant="ghost" onClick={() => setHowItWorksOpen(true)} p={0} position="absolute" left={2}>
                    <QuestionOutlineIcon boxSize="20px" />
                </Button>

                <Flex direction="column" flexGrow={1} justifyContent="space-between" width="100%" height="100%">
                    <Text textStyle="titleLg" align="center">
                        You Pay
                    </Text>
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
                                {LoadingStatus.LOADING == quoteStatus ? (
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
                                        variant={
                                            payTokenAmountHumanReadable != NO_AMOUNT_DISPLAY ? "primary" : "secondary"
                                        }
                                    >
                                        {payTokenAmountHumanReadable}
                                    </Text>
                                )}
                                <Text textStyle="bodyMd" variant="secondary">
                                    ${payTokenAmountHumanReadableUsd}
                                </Text>
                            </Flex>

                            <Flex flexDirection="column" justifyContent="center">
                                <TokenSelectButton
                                    selectedToken={payToken}
                                    onClickCallback={() => setTokenSelectOpen(true)}
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
                                <Text textStyle="headline">{requestTokenAmountHumanReadable}</Text>
                                <Text textStyle="bodyMd" variant="secondary">
                                    ${requestTokenAmountHumanReadableUsd}
                                </Text>
                            </Flex>
                            <Flex align="center">
                                <Avatar height="32px" width="32px" mr={2} src={requestToken?.logoURI}>
                                    <AvatarBadge borderWidth={2}>
                                        <Image
                                            src={requestChain?.iconUrlSync ?? ""}
                                            alt={requestChain?.name ?? ""}
                                            width={14}
                                            height={14}
                                            className="rounded-full"
                                        />
                                    </AvatarBadge>
                                </Avatar>
                                <Text textStyle="titleLg">{requestToken?.symbol}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <SummaryTable
                        entries={[
                            {
                                title: "Swap Rate",
                                value:
                                    quoteStatus === LoadingStatus.SUCCESS
                                        ? `1 ${requestToken?.symbol} = ${swapRate} ${payToken?.symbol}`
                                        : quoteStatus == LoadingStatus.LOADING
                                        ? ""
                                        : NO_AMOUNT_DISPLAY,
                                valueIcon:
                                    quoteStatus == LoadingStatus.LOADING ? (
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
                                    <Image
                                        src={requestChain?.iconUrlSync}
                                        alt={requestChain?.name}
                                        width={16}
                                        height={16}
                                    />
                                ),
                            },
                        ]}
                    />
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
            </PrimaryCardView>
            <Slide
                in={howItWorksOpen}
                direction="bottom"
                style={{ position: "absolute", padding: "inherit", height: "100%", width: "100%" }}
                unmountOnExit={true}
            >
                <HowItWorksView
                    closeCallback={() => setHowItWorksOpen(false)}
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
            </Slide>
            <Slide
                in={tokenSelectOpen}
                direction="bottom"
                style={{ position: "absolute", padding: "inherit", height: "100%", width: "100%" }}
                unmountOnExit={true}
            >
                <TokenSelectView
                    closeCallback={() => setTokenSelectOpen(false)}
                    token={payToken}
                    setToken={setPayToken}
                    customChain={requestChain}
                />
            </Slide>
        </>
    );
}
