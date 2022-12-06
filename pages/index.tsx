import { FC, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, Text, Flex, Fade, Center, Spinner, NumberInputField, NumberInput } from "@chakra-ui/react";
import { useConnectModal, useChainModal } from "@papercliplabs/rainbowkit";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import Image from "next/image";

import { useInsertRequestMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { FEE_BIPS } from "@/common/constants";
import { Token } from "@/common/types";
import { formatNumber } from "@/common/utils";
import TokenSelect from "@/components/TokenSelect";
import { PrimaryCard } from "@/layouts/PrimaryCardGrid";
import { useChain } from "@/hooks/useChain";
import { ConnectedAvatar } from "@/components/EnsAvatar";
import { ParentOverlay } from "@/components/ParentOverlay";
import { colors } from "@/theme/colors";

interface CreatingRequestOverlayProps {
  isOpen?: boolean;
}

const CreatingRequestOverlay: FC<CreatingRequestOverlayProps> = (props) => {
  const { isOpen = false } = props;
  return (
    <Fade in={isOpen}>
    <ParentOverlay p={4}>
      <Center display="flex" flexDirection="column" height="100%">
        <Spinner
          thickness="8px"
          speed="1.0s"
          emptyColor="bgPrimary"
          color="textInteractive"
          boxSize="72px"
          mb={4}
          style={{
            borderTopColor: colors.bgPrimary,
          }}
          />
        <Text textStyle="titleLg" mb={1}>Creating request</Text>
        <Text textStyle="bodyMd">Please wait...</Text>
      </Center>
    </ParentOverlay>
    </Fade>
  );
};

const CreateRequest: FC = () => {
  const router = useRouter();
  const { ensureUser } = useAuth();
  const [insertRequest] = useInsertRequestMutation();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(false);

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const activeChain = useChain();
  const { address } = useAccount();

  async function createRequest() {
    if (selectedToken != undefined && tokenAmount != "" && activeChain) {
      const tokenAmountRaw = ethers.utils.parseUnits(tokenAmount, selectedToken.decimals);

      setPendingConfirmation(true);
      const userId = await ensureUser();
      setPendingConfirmation(false);

      if (userId != undefined && userId != null) {
        const { data: insertData } = await insertRequest({
          variables: {
            object: {
              recipient_token_amount: tokenAmountRaw.toString(),
              recipient_token_address: selectedToken.address,
              chain_id: activeChain.id,
              user_id: userId,
            },
          },
        });

        const requestId = insertData?.insert_request_one?.id;
        router.push(`/request/${requestId}/share`);
      }
    } else {
      console.log("Invalid data");
    }
  }

  const tokenAmountUsd =
    selectedToken?.priceUsd && tokenAmount ? selectedToken.priceUsd * parseFloat(tokenAmount) : undefined;
  const feeAmountUsd = tokenAmountUsd ? (tokenAmountUsd * FEE_BIPS) / 10000 : 0;

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
    } else if (tokenAmount == "") {
      return { buttonText: "Enter token amount", onClickFunction: undefined, buttonVariant: "primary" };
    } else if (pendingConfirmation) {
      return { buttonText: "Waiting for signature", onClickFunction: undefined, buttonVariant: "primary" };
    } else {
      return { buttonText: "Get a link", onClickFunction: createRequest, buttonVariant: "primary" };
    }
  }, [tokenAmount, selectedToken, address, pendingConfirmation, activeChain.unsupported]);

  const ref = useRef(null);


  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mt={4}>
      <Text textStyle="headline">Send a request.</Text>
      <Text textStyle="headline" variant="gradient" mb={6}>
        Get paid in any token.
      </Text>
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
                onChange={(valueString: string) => setTokenAmount(parse(valueString))}
                value={tokenAmount}
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
                ${tokenAmountUsd ? formatNumber(tokenAmountUsd, 2, false) : "--"}
              </Text>
            </Flex>
            <TokenSelect portalRef={ref} token={selectedToken} setToken={setSelectedToken} isDisabled={activeChain?.unsupported} />
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
      <CreatingRequestOverlay isOpen={true} />
      </PrimaryCard>
    </Flex>
  );
};

const Index = () => {
  return <CreateRequest />;
};

export default Index;
