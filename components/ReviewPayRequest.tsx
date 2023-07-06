import { ReactElement, useMemo, useState } from "react";
import { Address, useSwitchNetwork } from "wagmi";
import { Box, Flex, Link, Text, Tooltip } from "@chakra-ui/react";
import Image from "next/image";

import { Length, Token } from "@/common/types";
import { Chain } from "@/hooks/useChain";
import FlowStepView from "@/layouts/FlowStepView";
import { ExplorerLinkType, useExplorerLink } from "@/hooks/useExplorerLink";
import { WalletAvatar } from "@/components/WalletAvatar";
import TokenWithChainIcon from "./TokenWithChainIcon";
import longArrowDown from "@/public/static/LongArrowDown.svg";
import { formatTokenAmount, shortAddress } from "@/common/utils";
import SummaryTable from "./SummaryTable";
import { InfoIcon } from "@chakra-ui/icons";
import { NO_AMOUNT_DISPLAY } from "@/common/constants";
import { useIsOnExpectedChain } from "@/hooks/useIsOnExpectedChain";

interface ReviewRequestRowProps {
    leftIcon?: ReactElement;
    topEntry?: ReactElement;
    bottomText?: string;
    rightIcon?: ReactElement;
}

function ReviewRequestRow({ leftIcon, topEntry, bottomText, rightIcon }: ReviewRequestRowProps) {
    return (
        <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Flex gap="16px" alignItems="center">
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
    payToken?: Token;
    payTokenAmount?: bigint;
    senderAddress?: Address;
    requestToken?: Token;
    requestTokenAmount?: bigint;
    recipientAddress?: Address;
    chain?: Chain;
    backButtonCallback: () => void;
    payButtonCallback?: () => void;
}

export default function ReviewPayRequest({
    payToken,
    payTokenAmount,
    senderAddress,
    requestToken,
    requestTokenAmount,
    recipientAddress,
    chain,
    backButtonCallback,
    payButtonCallback,
}: RequestReviewProps) {
    const [isFeeTooltipOpen, setIsFeeTooltipOpen] = useState<boolean>(false);

    const recipientExplorerLink = useExplorerLink(recipientAddress, ExplorerLinkType.WALLET_OR_CONTRACT, chain);
    const onExpectedChain = useIsOnExpectedChain(chain?.id);
    const { switchNetwork } = useSwitchNetwork();

    const [payTokenQuoteAmountHumanReadable, requestTokenAmountHumanReadable] = useMemo(() => {
        return [
            formatTokenAmount(payTokenAmount, payToken?.decimals, 6),
            formatTokenAmount(requestTokenAmount, requestToken?.decimals, 6),
        ];
    }, [payToken, payTokenAmount, requestToken, requestTokenAmount]);

    const swapRate =
        requestTokenAmountHumanReadable && payTokenQuoteAmountHumanReadable
            ? parseFloat(payTokenQuoteAmountHumanReadable) / parseFloat(requestTokenAmountHumanReadable)
            : NO_AMOUNT_DISPLAY;

    const payRequestBody = (
        <Flex p="16px" border="2px solid #EFF0F3" borderRadius="16px" direction="column" gap="1px" width="100%">
            <ReviewRequestRow
                leftIcon={<WalletAvatar address={senderAddress} size={40} />}
                topEntry={
                    <Text textStyle="titleSm" variant="secondary">
                        You send
                    </Text>
                }
                bottomText={`${payTokenQuoteAmountHumanReadable} ${payToken?.symbol}`}
                rightIcon={<TokenWithChainIcon token={payToken} chain={chain} size={32} />}
            />
            <Box pl="11px" py={1}>
                <Image src={longArrowDown} alt="check" />
            </Box>
            <ReviewRequestRow
                leftIcon={<WalletAvatar address={recipientAddress} size={40} />}
                topEntry={
                    <Text textStyle="titleSm" variant="secondary">
                        <Text textStyle="titleSm" textColor="primary" display="inline">
                            <Link href={recipientExplorerLink} isExternal>
                                {shortAddress(recipientAddress, Length.MEDIUM)}
                            </Link>
                        </Text>{" "}
                        receives
                    </Text>
                }
                bottomText={`${requestTokenAmountHumanReadable} ${requestToken?.symbol}`}
                rightIcon={<TokenWithChainIcon token={requestToken} chain={chain} size={32} />}
            />
        </Flex>
    );

    const bottomSummary = (
        <SummaryTable
            entries={[
                {
                    title: "Swap Rate",
                    value:
                        swapRate != NO_AMOUNT_DISPLAY
                            ? `1 ${requestToken?.symbol} = ${swapRate.toFixed(6)} ${payToken?.symbol}`
                            : NO_AMOUNT_DISPLAY,
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
                    value: chain?.name,
                    valueIcon: chain ? <Image src={chain?.iconUri} alt={chain?.name} width={16} height={16} /> : <></>,
                },
            ]}
            rowGap="8px"
        />
    );

    const buttonInfo = onExpectedChain
        ? {
              text: "Pay request",
              onClick: payButtonCallback,
          }
        : {
              text: "Switch to " + chain?.name,
              onClick: () => switchNetwork?.(chain?.id),
              critical: true,
          };

    return (
        <FlowStepView
            backButtonCallback={backButtonCallback}
            title="Review"
            custom={
                <Flex justifyContent="space-between" direction="column" width="100%" flexGrow={1} py="16px">
                    {payRequestBody}
                    {bottomSummary}
                </Flex>
            }
            primaryButtonInfo={buttonInfo}
        />
    );
}
