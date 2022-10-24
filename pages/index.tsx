import { FC, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button, Text, Flex, Box, GridItem, NumberInputField, NumberInput, Avatar } from "@chakra-ui/react";
import { useConnectModal } from "@papercliplabs/rainbowkit";
import { ethers } from "ethers";
import { useAccount, useEnsAvatar, useEnsName, useNetwork } from "wagmi";
import Image from "next/image";

import { useInsertRequestMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { FEE_BIPS } from "@/common/constants";
import { Token } from "@/common/types";
import { formatNumber } from "@/common/utils";
import TokenSelect from "@/components/TokenSelect";
import { PrimaryCardGrid } from "@/layouts/PrimaryCardGrid";
import { useChain } from "@/hooks/useChain";

const ellipsisMiddle = (str: string): string => {
  if (str.length < 10) {
    return str;
  }
  return str.slice(0, 6) + "..." + str.slice(-4);
};

const getInitials = (name: string): string => {
  // remove 0x if present
  name = name.replace(/^0x/, "");

  // get first threee letters
  const initials = name.slice(0, 3);

  return initials.toUpperCase();
};

const ConnectedAvatar = () => {
  const { isConnected, address } = useAccount();
  const { data: ensAvatarSrc } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  });

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  return isConnected ? (
    <Flex alignItems="center" flexDirection="column">
      <Avatar
        width="72px"
        height="72px"
        bg="accent.300"
        mb={2}
        name={address}
        getInitials={getInitials}
        src={ensAvatarSrc ?? ""}
      />
      <Text textStyle="h5" mb={2}>
        {ensName ? ensName : ellipsisMiddle(address ?? "")}
      </Text>
    </Flex>
  ) : (
    <Flex alignItems="center" flexDirection="column">

    <Box width="72px" height="72px" borderRadius="full" border="grayDashed" mb={4} />
    <Text variant="tertiary" textStyle="h5" mb={2} >
        Connect a Wallet
      </Text>
    </Flex>
  );
};

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
        router.push(`/request/${requestId}`);
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
      <Text textStyle="h3">Send a request.</Text>
      <Text textStyle="h3" variant="gradient" mb={6}>
        Get paid in any token.
      </Text>
      <PrimaryCardGrid>
        <GridItem
          gridRowStart={1}
          gridColumnStart={1}
          zIndex={1}
          height="100%"
          padding={4}
          display={"flex"}
          alignItems="center"
          justifyContent="space-between"
          flexDirection="column"
        >
          <ConnectedAvatar />
          <Text textStyle="h6" variant="interactive" mb={4}>
            Create a request
          </Text>
          <Flex
            width="100%"
            backgroundColor="bgSecondary"
            borderRadius="md"
            padding={6}
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex>
              <NumberInput onChange={(valueString: string) => setTokenAmount(parse(valueString))} value={tokenAmount}>
                <NumberInputField
                  placeholder="Enter an amount"
                  border="none"
                  textAlign="center"
                  p={0}
                  fontSize="xl"
                  lineHeight="xl"
                  fontWeight="bold"
                />
              </NumberInput>
            </Flex>
            <Text fontSize="xs" color="textTertiary">
              ${tokenAmountUsd ? formatNumber(tokenAmountUsd, 2, false) : "--"}
            </Text>

            <Flex flexDirection="column" justifyContent="center" mt={2}>
              <TokenSelect token={selectedToken} setToken={setSelectedToken} isDisabled={false} />
            </Flex>
          </Flex>
          <Flex flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
            <Flex flexDirection="row">
              <Text textStyle="body2" variant="secondary">
                Network
              </Text>
            </Flex>

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
              <Text pl="4px" fontSize="xs" color="textSecondary">
                {activeChain?.name}
              </Text>
            </Flex>
          </Flex>
          <Flex width="100%">
            <Button
              colorScheme="brand"
              type="submit"
              width="100%"
              minHeight="48px"
              size="lg"
              onClick={() => {
                onClickFunction && onClickFunction();
              }}
              isDisabled={onClickFunction == undefined}
            >
              {buttonText}
            </Button>
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
