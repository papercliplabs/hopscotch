import { FC, useState } from "react";
import { useRouter } from "next/router";
import { Button, Center, Container, Heading, Text, Input, Spacer, Flex, Tooltip } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useAccount, useNetwork } from "wagmi";

import { useInsertInvoiceMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { useTokenPriceUsd } from "@/common/hooks";
import { FEE_BIPS, SUPPORTED_CHAINS } from "@/common/constants";
import { Token } from "@/common/types";
import { formatNumber } from "@/common/utils";
import TokenSelector from "@/components/TokenSelector";

const CreateRequest: FC = () => {
  const router = useRouter();
  const { ensureUser } = useAuth();
  const [insertInvoice, { loading }] = useInsertInvoiceMutation();

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const { activeChain } = useNetwork();
  const { data: account } = useAccount();

  const tokenPriceUsd = useTokenPriceUsd(selectedToken);

  function createRequest() {
    if (selectedToken != undefined && tokenAmount != "" && activeChain) {
      const tokenAmountRaw = ethers.utils.parseUnits(tokenAmount, selectedToken.decimals);
      ensureUser().then((user) => {
        insertInvoice({
          variables: {
            object: {
              recipient_token_amount: tokenAmountRaw.toString(),
              recipient_token_address: selectedToken.address,
              chain_id: activeChain.id,
              user_id: user?.id,
            },
          },
        }).then(({ data }) => {
          const invoiceId = data?.insert_invoices_one?.id;
          router.push(`/request/${invoiceId}`);
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
          <Input
            id="amount"
            placeholder="Request amount"
            variant="unstyled"
            fontSize="xl"
            onChange={(e) => {
              // Only decimal number inputs
              const regex = /^[0-9]*[.]?[0-9]*$/;
              if (e.target.value == "" || regex.test(e.target.value)) {
                setTokenAmount(e.target.value);
              }
            }}
            value={tokenAmount}
          />
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
        <ConnectButton.Custom>
          {({ openConnectModal }) => {
            return (
              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                width="100%"
                size="lg"
                onClick={account ? createRequest : openConnectModal}
                isDisabled={account && (tokenAmount == "" || selectedToken == undefined)}
              >
                {account ? requestButtonMsg : "Connect Wallet"}
              </Button>
            );
          }}
        </ConnectButton.Custom>
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
