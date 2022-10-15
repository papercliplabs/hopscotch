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
  NumberInputField,
  NumberInput,
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

  const format = (val: string) => val;
  const parse = (val: string) => val.replace(/^\$/, "");

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
      <Text textStyle="h3" variant="gradient" mb={6}>
        Get paid in any token.
      </Text>
      <PrimaryCardGrid>
        <GridItem
          gridRowStart={1}
          gridColumnStart={1}
          zIndex={1}
          height="100%"
          margin={4}
          display={"flex"}
          alignItems="center"
          flexDirection="column"
        >
          <Text textStyle="h6" variant="gradient" mb={2}>
            Create a request
          </Text>
          <Flex
            width="100%"
            backgroundColor="bgSecondary"
            borderRadius="md"
            padding={3}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex>
              <NumberInput
                placeholder="0.00"
                precision={4}
                onChange={(valueString: string) => setTokenAmount(parse(valueString))}
                value={format(tokenAmount)}
              >
                <NumberInputField border="none" textAlign="center" p={0} fontSize="xl" lineHeight="xl" fontWeight="bold" />
              </NumberInput>
            </Flex>
            <Text fontSize="xs" color="textTertiary">
              ${formatNumber(tokenAmountUsd)}
            </Text>

            <Flex flexDirection="column" justifyContent="center" mt={2}>
              <TokenSelect token={selectedToken} setToken={setSelectedToken} isDisabled={false} />
            </Flex>
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
          <Flex flexDirection="row" width="100%" justifyContent="space-between" alignItems="center" mt={5}>
            <Flex flexDirection="row">
              <Text textStyle="body2" variant="secondary">
                Estimated fee{" "}
                <Tooltip label="Hopscotch transaction fee">
                  <QuestionOutlineIcon />
                </Tooltip>
              </Text>
            </Flex>
            <Text fontSize="sm" color="textSecondary">
              ${formatNumber(feeAmountUsd)}
            </Text>
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
