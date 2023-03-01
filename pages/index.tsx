import { useMemo, useRef, useState } from "react";
import { Button, Text, Flex, Fade, NumberInputField, NumberInput } from "@chakra-ui/react";
import { useConnectModal, useChainModal } from "@papercliplabs/rainbowkit";
import { useAccount } from "wagmi";
import Image from "next/image";

import { FEE_BIPS } from "@/common/constants";
import { ExplorerLinkType, Token } from "@/common/types";
import { formatNumber, parseTokenAmount, stringToNumber } from "@/common/utils";
import TokenSelect from "@/components/TokenSelect";
import { PrimaryCard } from "@/layouts/PrimaryCardGrid";
import { useChain } from "@/hooks/useChain";
import { ConnectedAvatar } from "@/components/EnsAvatar";
import { useCreateRequest } from "@/hooks/useCreateRequest";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import PendingTransactionOverlay from "@/components/PendingTransactionOverlay";
import PendingSignatureOverlay from "@/components/PendingSignatureOverlay";
import FailedTransactionOverlay from "@/components/FailedTransactionOverlay";
import CopyLinkOverlay from "@/components/CopyLinkOverlay";

function CreateRequest() {
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

    const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
    const [tokenAmountHumanReadable, setTokenAmountHumanReadable] = useState<string>("");
    const activeChain = useChain();
    const { address } = useAccount();

    const tokenAmount = useMemo(() => {
        return parseTokenAmount(tokenAmountHumanReadable, selectedToken?.decimals);
    }, [tokenAmountHumanReadable, selectedToken]);

    const { createRequest, transaction, pendingWalletSignature, abortPendingSignature, clearTransaction } =
        useCreateRequest(selectedToken?.address, tokenAmount);

    const transactionExplorerLink = useExplorerLink(transaction?.hash, ExplorerLinkType.TRANSACTION, activeChain);

    const tokenAmountHumanReadableUsd =
        selectedToken?.priceUsd && tokenAmountHumanReadable
            ? selectedToken.priceUsd * parseFloat(tokenAmountHumanReadable)
            : undefined;

    const parse = (val: string) => val.replace(/^\$/, "");

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
    }, [tokenAmountHumanReadable, selectedToken, address, activeChain.unsupported]);

    const ref = useRef(null);

    return (
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mt={4}>
            <Text textStyle="headline">Send a request.</Text>
            <Text textStyle="headline" variant="gradient" mb={6}>
                Get paid in any token.
            </Text>
            <Fade in delay={1}>
                <PrimaryCard
                    ref={ref}
                    position="relative"
                    height="100%"
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection="column"
                    padding={4}
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
                        <Flex direction="column" gap="8px">
                            <NumberInput
                                height="48px"
                                onChange={(valueString: string) => setTokenAmountHumanReadable(parse(valueString))}
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
                                $
                                {tokenAmountHumanReadableUsd
                                    ? formatNumber(tokenAmountHumanReadableUsd, 2, false)
                                    : "--"}
                            </Text>
                        </Flex>
                        <TokenSelect
                            portalRef={ref}
                            token={selectedToken}
                            setToken={setSelectedToken}
                            isDisabled={activeChain?.unsupported}
                        />
                    </Flex>

                    <Flex direction="column" width="100%" gap={4}>
                        <Flex flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
                            <Text textStyle="label" variant="secondary">
                                Network
                            </Text>

                            <Flex align="center">
                                <Image
                                    src={activeChain?.iconUrlSync}
                                    alt={activeChain?.name}
                                    width={16}
                                    height={16}
                                    layout="fixed"
                                    objectFit="contain"
                                    className="rounded-full"
                                />
                                <Text pl="4px" textStyle="label" variant="secondary">
                                    {activeChain?.name}
                                </Text>
                            </Flex>
                        </Flex>

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

                    <PendingSignatureOverlay
                        abortSignatureCallback={abortPendingSignature}
                        isOpen={pendingWalletSignature}
                        title="Create Request"
                    />

                    <PendingTransactionOverlay
                        isOpen={transaction?.status == "pending"}
                        title="Create Request"
                        transactionLink={transactionExplorerLink}
                    />

                    <CopyLinkOverlay
                        isOpen={transaction?.status == "confirmed"}
                        requestSummary={`${tokenAmountHumanReadable} ${selectedToken?.symbol} on ${activeChain?.name}`}
                        chainId={activeChain?.id}
                        requestId={12}
                        transactionLink={transactionExplorerLink}
                    />

                    <FailedTransactionOverlay
                        isOpen={transaction?.status == "failed"}
                        subtitle="Request creation failed!"
                        transactionLink={transactionExplorerLink}
                        actionButtonText="Try again"
                        actionButtonCallback={() => clearTransaction()}
                    />
                </PrimaryCard>
            </Fade>
        </Flex>
    );
}

const Index = () => {
    return <CreateRequest />;
};

export default Index;
