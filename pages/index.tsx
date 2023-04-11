import { useMemo, useRef, useState } from "react";
import { Button, Text, Flex, NumberInputField, NumberInput, Avatar } from "@chakra-ui/react";
import { useConnectModal, useChainModal } from "@papercliplabs/rainbowkit";
import { useAccount } from "wagmi";
import Image from "next/image";
import dynamic from "next/dynamic";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

import { ExplorerLinkType, Token } from "@/common/types";
import { formatNumber, parseTokenAmount } from "@/common/utils";
import TokenSelectView from "@/views/TokenSelectView";
import { PrimaryCard } from "@/layouts/PrimaryCardGrid";
import { useChain } from "@/hooks/useChain";
import { ConnectedAvatar } from "@/components/EnsAvatar";
import { useCreateRequest } from "@/hooks/useCreateRequest";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import PendingTransactionView from "@/views/PendingTransactionView";
import PendingSignatureView from "@/views/PendingSignatureView";
import FailedTransactionView from "@/views/FailedTransactionView";
import CopyLinkView from "@/views/CopyLinkView";
import Head from "next/head";
import HowItWorksView from "@/views/HowItWorksView";
import { NO_AMOUNT_DISPLAY } from "@/common/constants";
import TokenSelectButton from "@/components/TokenSelectButton";
import SummaryTable from "@/components/SummaryTable";

function CreateRequest() {
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

    const [HowItWorksViewOpen, setHowItWorksViewOpen] = useState<boolean>(false);
    const [tokenSelectOpen, setTokenSelectOpen] = useState<boolean>(false);

    const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);

    const [tokenAmountHumanReadable, setTokenAmountHumanReadable] = useState<string>("");
    const activeChain = useChain();
    const { address } = useAccount();

    const tokenAmount = useMemo(() => {
        return parseTokenAmount(tokenAmountHumanReadable, selectedToken?.decimals);
    }, [tokenAmountHumanReadable, selectedToken]);

    const { createRequest, requestId, transaction, pendingWalletSignature, abortPendingSignature, clearTransaction } =
        useCreateRequest(selectedToken?.address, tokenAmount);

    const transactionExplorerLink = useExplorerLink(transaction?.hash, ExplorerLinkType.TRANSACTION, activeChain);

    const tokenAmountHumanReadableUsd =
        selectedToken?.priceUsd && tokenAmountHumanReadable
            ? selectedToken.priceUsd * parseFloat(tokenAmountHumanReadable)
            : undefined;

    const parseNumber = (val: string, lastVal: string) => {
        if (val.match(/^\d{1,}(\.\d{0,20})?$/) || val.length == 0) {
            return val;
        } else {
            return lastVal;
        }
    };

    // Compute the button state
    const { buttonText, onClickFunction, buttonVariant } = useMemo(() => {
        if (activeChain.unsupported) {
            return {
                buttonText: "Wrong network",
                onClickFunction: () => (openChainModal ? openChainModal() : null),
                buttonVariant: "critical",
            };
        } else if (!address) {
            return { buttonText: "Connect wallet", onClickFunction: openConnectModal, buttonVariant: "secondary" };
        } else if (selectedToken == undefined) {
            return { buttonText: "Choose a token", onClickFunction: undefined, buttonVariant: "primary" };
        } else if (tokenAmountHumanReadable == "") {
            return { buttonText: "Enter token amount", onClickFunction: undefined, buttonVariant: "primary" };
        } else {
            return { buttonText: "Create request", onClickFunction: createRequest, buttonVariant: "primary" };
        }
    }, [
        tokenAmountHumanReadable,
        selectedToken,
        address,
        activeChain.unsupported,
        createRequest,
        openConnectModal,
        openChainModal,
    ]);

    const ref = useRef(null);

    const createRequestBase = (
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
                        onChange={(valueString: string) =>
                            setTokenAmountHumanReadable(parseNumber(valueString, tokenAmountHumanReadable))
                        }
                        value={tokenAmountHumanReadable}
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
                        {tokenAmountHumanReadableUsd
                            ? `$${formatNumber(tokenAmountHumanReadableUsd, 2, false)}`
                            : NO_AMOUNT_DISPLAY}
                    </Text>
                    <TokenSelectButton selectedToken={selectedToken} onClickCallback={() => setTokenSelectOpen(true)} />
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
    );

    return (
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mt={4}>
            <Text textStyle="headline">Send a request.</Text>
            <Text textStyle="headline" variant="gradient" mb={6}>
                Get paid in any token.
            </Text>
            <PrimaryCard ref={ref}>
                <Button variant="ghost" onClick={() => setHowItWorksViewOpen(true)} p={0} position="absolute" left={2}>
                    <QuestionOutlineIcon boxSize="20px" />
                </Button>

                {createRequestBase}

                <HowItWorksView
                    isOpen={HowItWorksViewOpen}
                    closeCallback={() => setHowItWorksViewOpen(false)}
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

                <TokenSelectView
                    isOpen={tokenSelectOpen}
                    closeCallback={() => setTokenSelectOpen(false)}
                    token={selectedToken}
                    setToken={setSelectedToken}
                />

                <PendingSignatureView
                    abortSignatureCallback={abortPendingSignature}
                    isOpen={pendingWalletSignature}
                    title="Create Request"
                />

                <PendingTransactionView
                    isOpen={
                        transaction?.status == "pending" ||
                        (transaction?.status == "confirmed" && requestId == undefined)
                    }
                    title="Create Request"
                    transactionLink={transactionExplorerLink}
                />

                <CopyLinkView
                    isOpen={transaction?.status == "confirmed" && requestId != undefined}
                    requestSummary={`${tokenAmountHumanReadable} ${selectedToken?.symbol} on ${activeChain?.name}`}
                    chainId={activeChain?.id}
                    requestId={requestId}
                    transactionLink={transactionExplorerLink}
                />

                <FailedTransactionView
                    isOpen={transaction?.status == "failed"}
                    subtitle="Request creation failed!"
                    transactionLink={transactionExplorerLink}
                    actionButtonText="Try again"
                    actionButtonCallback={() => clearTransaction()}
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
