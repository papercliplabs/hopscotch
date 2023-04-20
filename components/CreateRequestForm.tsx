import { ReactElement, useMemo, useState } from "react";
import { Flex, NumberInputField, Text, NumberInput, Button, Fade, Slide } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useChainModal, useConnectModal } from "@papercliplabs/rainbowkit";
import { useAccount } from "wagmi";
import Image from "next/image";

import PrimaryCardView from "@/layouts/PrimaryCardView";
import HowItWorksView from "@/views/HowItWorksView";
import TokenSelectButton from "./TokenSelectButton";
import TokenSelectView from "@/views/TokenSelectView";
import SummaryTable from "./SummaryTable";
import { ConnectedAvatar } from "./EnsAvatar";
import { Token } from "@/common/types";
import { useChain } from "@/hooks/useChain";
import { formatNumber } from "@/common/utils";
import { NO_AMOUNT_DISPLAY } from "@/common/constants";

interface CreateRequestFormProps {
    requestToken?: Token;
    requestTokenAmountHumanReadable?: string;
    setRequestToken: (token?: Token) => void;
    setRequestTokenAmountHumanReadable: (amount?: string) => void;
    submit?: () => void;
}

export default function CreateRequestForm({
    requestToken,
    requestTokenAmountHumanReadable,
    setRequestToken,
    setRequestTokenAmountHumanReadable,
    submit,
}: CreateRequestFormProps): ReactElement {
    const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
    const [tokenSelectOpen, setTokenSelectOpen] = useState<boolean>(false);

    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();
    const { address } = useAccount();
    const activeChain = useChain();

    const requestAmountHumanReadableUsd = useMemo(() => {
        return requestToken?.priceUsd && requestTokenAmountHumanReadable
            ? requestToken.priceUsd * parseFloat(requestTokenAmountHumanReadable)
            : NO_AMOUNT_DISPLAY;
    }, [requestTokenAmountHumanReadable, requestToken]);

    const { buttonText, onClickFunction, buttonVariant } = useMemo(() => {
        if (activeChain.unsupported) {
            return {
                buttonText: "Wrong network",
                onClickFunction: () => (openChainModal ? openChainModal() : null),
                buttonVariant: "critical",
            };
        } else if (!address) {
            return { buttonText: "Connect wallet", onClickFunction: openConnectModal, buttonVariant: "secondary" };
        } else if (requestToken == undefined) {
            return { buttonText: "Choose a token", onClickFunction: undefined, buttonVariant: "primary" };
        } else if (requestTokenAmountHumanReadable == undefined) {
            return { buttonText: "Enter token amount", onClickFunction: undefined, buttonVariant: "primary" };
        } else {
            return { buttonText: "Create request", onClickFunction: submit, buttonVariant: "primary" };
        }
    }, [
        requestTokenAmountHumanReadable,
        requestToken,
        address,
        activeChain.unsupported,
        submit,
        openConnectModal,
        openChainModal,
    ]);

    const parseNumber = (val: string, lastVal?: string) => {
        if (val.match(/^\d{1,}(\.\d{0,20})?$/) || val.length == 0) {
            return val;
        } else {
            return lastVal;
        }
    };

    return (
        <>
            <PrimaryCardView>
                <Button variant="ghost" onClick={() => setHowItWorksOpen(true)} p={0} position="absolute" left={2}>
                    <QuestionOutlineIcon boxSize="20px" />
                </Button>

                <Flex
                    width="100%"
                    height="100%"
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection="column"
                    display={"flex"}
                >
                    <Flex direction="column" align="center" width="100%">
                        <ConnectedAvatar />
                        <Text textStyle="titleSm" variant="interactive" mb={4}>
                            Create a request
                        </Text>
                    </Flex>

                    <Flex
                        width="100%"
                        backgroundColor="bgSecondary"
                        borderRadius="md"
                        padding={4}
                        mb={4}
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="space-between"
                        gap="16px"
                    >
                        <Flex direction="column" gap="8px" alignItems="center">
                            <NumberInput
                                height="48px"
                                onChange={(valueString) =>
                                    setRequestTokenAmountHumanReadable(
                                        parseNumber(valueString, requestTokenAmountHumanReadable)
                                    )
                                }
                                value={requestTokenAmountHumanReadable}
                                min={0}
                            >
                                <NumberInputField
                                    _focusVisible={{
                                        borderWidth: "1.75px",
                                        borderColor: "primary",
                                        borderRadius: "xs",
                                        backgroundColor: "bgTertiary",
                                    }}
                                    outline="none"
                                    placeholder="Enter an amount"
                                    borderWidth="0px"
                                    textAlign="center"
                                    fontSize="xl"
                                    lineHeight="xl"
                                    fontWeight="bold"
                                    height="100%"
                                    width="100%"
                                    p={0}
                                />
                            </NumberInput>
                            <Text textStyle="bodyMd" color="textSecondary" width="100%" align="center">
                                {requestAmountHumanReadableUsd
                                    ? `$${formatNumber(requestAmountHumanReadableUsd, 2, false)}`
                                    : NO_AMOUNT_DISPLAY}
                            </Text>
                            <TokenSelectButton
                                selectedToken={requestToken}
                                onClickCallback={() => setTokenSelectOpen(true)}
                            />
                        </Flex>
                    </Flex>

                    <Flex direction="column" width="100%" gap={4}>
                        <SummaryTable
                            entries={[
                                {
                                    title: "Network",
                                    value: activeChain?.name,
                                    valueIcon: (
                                        <Image
                                            src={activeChain?.iconUrlSync ?? ""}
                                            alt={activeChain?.name}
                                            width={16}
                                            height={16}
                                        />
                                    ),
                                },
                            ]}
                        />

                        <Flex width="100%">
                            <Button
                                type="submit"
                                width="100%"
                                height="48px"
                                size="lg"
                                onClick={() => {
                                    onClickFunction && onClickFunction();
                                }}
                                isDisabled={onClickFunction == undefined}
                                variant={buttonVariant}
                            >
                                {buttonText}
                            </Button>
                        </Flex>
                    </Flex>
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
                        title: "Create a link",
                        description: "Choose the token and amount you want to receive.",
                    }}
                    stepTwoInfo={{
                        title: "Share it",
                        description: "Copy the link and share it with anyone, anywhere!",
                    }}
                    stepThreeInfo={{
                        title: "Get paid",
                        description: "Links can be paid with any ERC20 token, you’ll get what you asked for.",
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
                    token={requestToken}
                    setToken={setRequestToken}
                />
            </Slide>
        </>
    );
}
