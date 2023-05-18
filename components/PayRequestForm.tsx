import { useMemo, useState } from "react";
import { useAccount, Address, useSwitchNetwork } from "wagmi";
import { BigNumber } from "@ethersproject/bignumber";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Avatar, AvatarBadge, Button, Flex, Slide, Text, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import Image from "next/image";

import { LoadingStatus, Token } from "@/common/types";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";
import PrimaryCardView from "@/layouts/PrimaryCardView";
import { useChain } from "@/hooks/useChain";
import { useToken } from "@/hooks/useTokenList";
import TokenSelectButton from "./TokenSelectButton";
import { formatNumber } from "@/common/utils";
import { NO_AMOUNT_DISPLAY } from "@/common/constants";
import HowItWorks from "@/components/HowItWorks";
import TokenSelectView from "@/components/TokenSelectView";
import SummaryTable from "./SummaryTable";
import Spinner from "./Spinner";
import { formatUnits } from "@ethersproject/units";
import { Question } from "@phosphor-icons/react";
import { Request } from "@/hooks/useRequest";

interface PayRequestFormProps {
    request?: Request;
    payToken?: Token;
    quoteStatus?: LoadingStatus;
    payTokenQuoteAmount?: BigNumber;
    setPayTokenAddress: (address?: Address) => void;
    submit: () => void;
}

export default function PayRequestForm({
    request,
    payToken,
    quoteStatus,
    payTokenQuoteAmount,
    setPayTokenAddress,
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
        const payTokenAmountHumanReadable =
            payTokenQuoteAmount && payToken?.decimals
                ? formatUnits(payTokenQuoteAmount, payToken?.decimals)
                : NO_AMOUNT_DISPLAY;
        const requestTokenAmountHumanReadable =
            request?.recipientTokenAmount && requestToken?.decimals
                ? formatUnits(request.recipientTokenAmount, requestToken.decimals)
                : NO_AMOUNT_DISPLAY;
        const payTokenAmountHumanReadableUsd =
            payToken?.priceUsd && payTokenAmountHumanReadable != NO_AMOUNT_DISPLAY
                ? payToken.priceUsd * parseFloat(payTokenAmountHumanReadable)
                : NO_AMOUNT_DISPLAY;
        const requestTokenAmountHumanReadableUsd =
            requestToken?.priceUsd && requestTokenAmountHumanReadable != NO_AMOUNT_DISPLAY
                ? requestToken.priceUsd * parseFloat(requestTokenAmountHumanReadable)
                : NO_AMOUNT_DISPLAY;

        return [
            formatNumber(payTokenAmountHumanReadable, 6),
            formatNumber(payTokenAmountHumanReadableUsd, 2, "$"),
            formatNumber(requestTokenAmountHumanReadable, 6),
            formatNumber(requestTokenAmountHumanReadableUsd, 2, "$"),
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
                    <Question size={24} />
                </Button>

                <Flex direction="column" flexGrow={1} justifyContent="space-between" width="100%" height="100%">
                    <Text textStyle="titleLg" align="center">
                        Pay Request
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
                                <Text textStyle="titleSm" variant="secondary">
                                    Pay with
                                </Text>
                                {LoadingStatus.LOADING == quoteStatus ? (
                                    <Flex height="32px" alignItems="center">
                                        <Spinner size="30px" />
                                    </Flex>
                                ) : (
                                    <Text
                                        textStyle={["titleMd", "headline"]}
                                        variant={
                                            payTokenAmountHumanReadable != NO_AMOUNT_DISPLAY ? "primary" : "secondary"
                                        }
                                    >
                                        {payTokenAmountHumanReadable}
                                    </Text>
                                )}
                                <Text textStyle="bodyMd" variant="secondary">
                                    {payTokenAmountHumanReadableUsd}
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
                                    They receive
                                </Text>
                                <Text textStyle={"titleMd"}>{requestTokenAmountHumanReadable}</Text>
                                <Text textStyle="bodyMd" variant="secondary">
                                    {requestTokenAmountHumanReadableUsd}
                                </Text>
                            </Flex>
                            <Flex align="center">
                                <Avatar height="32px" width="32px" mr={2} src={requestToken?.logoURI}>
                                    <AvatarBadge borderWidth={2}>
                                        <Image
                                            src={requestChain?.iconUri ?? ""}
                                            alt={requestChain?.name ?? ""}
                                            width={14}
                                            height={14}
                                            className="rounded-full"
                                        />
                                    </AvatarBadge>
                                </Avatar>
                                <Text textStyle={["titleSm", "titleLg"]}>{requestToken?.symbol}</Text>
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
                                valueIcon: quoteStatus == LoadingStatus.LOADING ? <Spinner size="20px" /> : undefined,
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
                                        src={requestChain?.iconUri}
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
                <HowItWorks
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
                    setTokenAddress={setPayTokenAddress}
                    customChain={requestChain}
                />
            </Slide>
        </>
    );
}
