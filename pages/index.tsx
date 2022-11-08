import { FC, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button, Text, Flex, Box, GridItem, NumberInputField, NumberInput } from "@chakra-ui/react";
import { useConnectModal } from "@papercliplabs/rainbowkit";
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
  const { buttonText, onClickFunction } = useMemo(() => {
    if (!address) {
      return { buttonText: "Connect Wallet", onClickFunction: openConnectModal };
    } else if (selectedToken == undefined) {
      return { buttonText: "Select Token", onClickFunction: undefined };
    } else if (tokenAmount == "") {
      return { buttonText: "Enter Token Amount", onClickFunction: undefined };
    } else if (pendingConfirmation) {
      return { buttonText: "Confirm In Wallet", onClickFunction: undefined };
    } else {
      return { buttonText: "Create Request", onClickFunction: createRequest };
    }
  }, [tokenAmount, selectedToken, address, pendingConfirmation]);

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="space-between">
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
            <Text textStyle="bodyMedium" color="textTertiary">
              ${tokenAmountUsd ? formatNumber(tokenAmountUsd, 2, false) : "--"}
            </Text>

            <Flex flexDirection="column" justifyContent="center" mt={2}>
              <TokenSelect token={selectedToken} setToken={setSelectedToken} isDisabled={false} />
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
                colorScheme="brand"
                type="submit"
                width="100%"
                height="48px"
                size="lg"
                onClick={() => {
                  onClickFunction && onClickFunction();
                }}
                isDisabled={onClickFunction == undefined}
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
