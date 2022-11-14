import { FC, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button, Text, Flex, Box, GridItem, NumberInputField, NumberInput } from "@chakra-ui/react";
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
import { PrimaryCardGrid } from "@/layouts/PrimaryCardGrid";
import { useChain } from "@/hooks/useChain";
import { ConnectedAvatar } from "@/components/EnsAvatar";

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

  console.log("ADDRESS", address);

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
      return { buttonText: "Select token", onClickFunction: undefined, buttonVariant: "primary" };
    } else if (tokenAmount == "") {
      return { buttonText: "Enter token amount", onClickFunction: undefined, buttonVariant: "primary" };
    } else if (pendingConfirmation) {
      return { buttonText: "Waiting for signature", onClickFunction: undefined, buttonVariant: "primary" };
    } else {
      return { buttonText: "Get a link", onClickFunction: createRequest, buttonVariant: "primary" };
    }
  }, [tokenAmount, selectedToken, address, pendingConfirmation, activeChain.unsupported]);

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mt={4}>
      <Text textStyle="headline">Send a request.</Text>
      <Text textStyle="headline" variant="gradient" mb={6}>
        Get paid in any token.
      </Text>
      <PrimaryCardGrid>
        <GridItem
          zIndex={1}
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          flexDirection="column"
          padding={4}
          display={"flex"}
          gridRowStart={1}
          gridColumnStart={1}
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
          >
            <NumberInput onChange={(valueString: string) => setTokenAmount(parse(valueString))} value={tokenAmount}>
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
              />
            </NumberInput>
            <Text textStyle="bodyMedium" color="textTertiary" width="100%" align="center">
              ${tokenAmountUsd ? formatNumber(tokenAmountUsd, 2, false) : "--"}
            </Text>

            <Flex flexDirection="column" justifyContent="center" mt={2}>
              <TokenSelect token={selectedToken} setToken={setSelectedToken} isDisabled={activeChain?.unsupported} />
            </Flex>
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
        </GridItem>
      </PrimaryCardGrid>
    </Flex>
  );
};

const Index = () => {
  return <CreateRequest />;
};

export default Index;
