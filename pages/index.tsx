import { FC, useState } from "react";
import { useRouter } from "next/router";
import { Button, Center, Container, Heading, Text, Input, Spacer, Flex, Tooltip } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { ConnectButton, useConnectModal } from "@papercliplabs/rainbowkit";
import { ethers } from "ethers";
import { useAccount, useNetwork } from "wagmi";

import { useInsertRequestMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { FEE_BIPS, SUPPORTED_CHAINS } from "@/common/constants";
import { Token } from "@/common/types";
import { formatNumber } from "@/common/utils";
import TokenSelector from "@/components/TokenSelector";
import { NumberInput } from "@/components/NumberInput";

const CreateRequest: FC = () => {
  const router = useRouter();
  const { ensureUser } = useAuth();
  const [insertRequest, { loading }] = useInsertRequestMutation();
  const { openConnectModal } = useConnectModal();

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const { chain: activeChain } = useNetwork();
  const { address } = useAccount();

  const tokenPriceUsd = 1; // TODO

  function createRequest() {
    if (selectedToken != undefined && tokenAmount != "" && activeChain) {
      const tokenAmountRaw = ethers.utils.parseUnits(tokenAmount, selectedToken.decimals);
      ensureUser().then((user) => {
        insertRequest({
          variables: {
            object: {
              recipient_token_amount: tokenAmountRaw.toString(),
              recipient_token_address: selectedToken.address,
              chain_id: activeChain.id,
              user_id: user?.id,
            },
          },
        }).then(({ data }) => {
          const requestId = data?.insert_request_one?.id;
          router.push(`/request/${requestId}`);
        });
      });
    } else {
      console.log("Invalid data");
    }
  }

  const tokenAmountUsd = tokenPriceUsd && tokenAmount ? tokenPriceUsd * parseFloat(tokenAmount) : 0;
  const feeAmountUsd = tokenAmountUsd ? (tokenAmountUsd * FEE_BIPS) / 10000 : 0;

  const requestButtonMsg =
    tokenAmount == "" ? "Enter token amount" : selectedToken == undefined ? "Select token" : "Create request";

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="456px" width="100%" gap="0.5">
      <Heading size="lg" fontWeight="semibold" color="text0" mb={2}>
        Create your request
      </Heading>
      <Text size="md" mb={4} color="text1">
        Get a link you can send anyone to pay you
      </Text>

      <Flex
        width="100%"
        backgroundColor="bg1"
        borderTopRadius="sm"
        padding="3"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Flex direction="column" flex="1">
          <NumberInput placeholder="Request amount" setNumCallback={setTokenAmount} />
          <Text fontSize="xs" color="text2">
            ${formatNumber(tokenAmountUsd)}
          </Text>
        </Flex>

        <Flex flexDirection="column" justifyContent="center">
          <TokenSelector selectedTokenCallback={setSelectedToken} />
        </Flex>
      </Flex>
      <Spacer height="2px" />
      <Flex width="100%" backgroundColor="bg1" borderBottomRadius="sm" padding="2" flexDirection="row">
        <Text>On {activeChain ? activeChain.name : SUPPORTED_CHAINS[0].name}</Text>
        <Text fontSize="xs" color="text1">
          (alpha)
        </Text>
      </Flex>

      <Flex flexDirection="row" width="100%" justifyContent="space-between">
        <Flex flexDirection="row">
          <Text fontSize="sm" color="text1">
            <Tooltip label="Hopscotch transaction fee">
              <QuestionOutlineIcon />
            </Tooltip>{" "}
            Estimated fee
          </Text>
        </Flex>
        <Text fontSize="sm" color="text1">
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
          onClick={address ? createRequest : openConnectModal}
          isDisabled={!!address && (tokenAmount == "" || selectedToken == undefined)}
        >
          {address ? requestButtonMsg : "Connect Wallet"}
        </Button>
      </Flex>
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
