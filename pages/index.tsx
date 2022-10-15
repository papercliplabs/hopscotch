import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Center,
  Container,
  Heading,
  Text,
  Input,
  Spacer,
  Flex,
  Tooltip,
  Box,
  GridItem,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { ConnectButton, useConnectModal } from "@papercliplabs/rainbowkit";
import { ethers } from "ethers";
import { useAccount, useNetwork } from "wagmi";

import { useInsertRequestMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { FEE_BIPS, SUPPORTED_CHAINS } from "@/common/constants";
import { Token } from "@/common/types";
import { formatNumber } from "@/common/utils";
import TokenSelect from "@/components/TokenSelect";
import { NumberInput } from "@/components/NumberInput";
import { PrimaryCardGrid } from "@/layouts/PrimaryCardGrid";

const CreateRequest: FC = () => {
  const router = useRouter();
  const { ensureUser } = useAuth();
  const [insertRequest, { loading }] = useInsertRequestMutation();
  const { openConnectModal } = useConnectModal();
  console.log(openConnectModal);

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const { chain: activeChain } = useNetwork();
  const { address } = useAccount();

  const tokenPriceUsd = 1; // TODO

  async function createRequest() {
    if (selectedToken != undefined && tokenAmount != "" && activeChain) {
      const tokenAmountRaw = ethers.utils.parseUnits(tokenAmount, selectedToken.decimals);
      const userId = await ensureUser();

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

  const tokenAmountUsd = tokenPriceUsd && tokenAmount ? tokenPriceUsd * parseFloat(tokenAmount) : 0;
  const feeAmountUsd = tokenAmountUsd ? (tokenAmountUsd * FEE_BIPS) / 10000 : 0;

  const requestButtonMsg = useMemo(() => {
    return tokenAmount == "" ? "Enter token amount" : selectedToken == undefined ? "Select token" : "Create request";
  }, []);

  // Compute the button state
  const { buttonText, onClickFunction } = useMemo(() => {
    if (!address) {
      return { buttonText: "Connect Wallet", onClickFunction: openConnectModal };
    } else if (selectedToken == undefined) {
      return { buttonText: "Select Token", onClickFunction: undefined };
    } else if (tokenAmount == "") {
      return { buttonText: "Enter Token Amount", onClickFunction: undefined };
    } else {
      return { buttonText: "Create Request", onClickFunction: createRequest };
    }
  }, [tokenAmount, selectedToken, address]);

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
    <Text textStyle="h3">Send a request.</Text>
    <Text textStyle="h3">Get paid in any token.</Text>
    <PrimaryCardGrid>
      <GridItem gridRowStart={1} gridColumnStart={1} zIndex={1} height="100%" margin={4}>
        <Text textStyle="h3" mb={2}>
          Create your request
        </Text>
        <Text size="md" mb={4} color="textSecondary">
          Get a link you can send anyone to pay you
        </Text>

        <Flex
          width="100%"
          backgroundColor="bgSecondary"
          borderTopRadius="sm"
          padding="3"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Flex direction="column" flex="1">
            <NumberInput placeholder="Request amount" setNumCallback={setTokenAmount} />
            <Text fontSize="xs" color="textTertiary">
              ${formatNumber(tokenAmountUsd)}
            </Text>
          </Flex>

          <Flex flexDirection="column" justifyContent="center">
            <TokenSelect token={selectedToken} setToken={setSelectedToken} isDisabled={false} />
          </Flex>
        </Flex>
        <Spacer height="2px" />
        <Flex width="100%" backgroundColor="bgSecondary" borderBottomRadius="sm" padding="2" flexDirection="row">
          <Text>On {activeChain ? activeChain.name : SUPPORTED_CHAINS[0].name}</Text>
          <Text fontSize="xs" color="textSecondary">
            (alpha)
          </Text>
        </Flex>

        <Flex flexDirection="row" width="100%" justifyContent="space-between">
          <Flex flexDirection="row">
            <Text fontSize="sm" color="textSecondary">
              <Tooltip label="Hopscotch transaction fee">
                <QuestionOutlineIcon />
              </Tooltip>{" "}
              Estimated fee
            </Text>
          </Flex>
          <Text fontSize="sm" color="textSecondary">
            ${formatNumber(feeAmountUsd)}
          </Text>
        </Flex>

        <Flex width="100%">
          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            width="100%"
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
  return (
    <Container width="100%" height="100vh" maxW="832px">
      <Center height="60%">
        <CreateRequest />
      </Center>
    </Container>
  );
};

export default Index;
