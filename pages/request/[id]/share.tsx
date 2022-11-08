import { FC, useMemo, useState } from "react";
import {
  Button,
  Text,
  Flex,
  Box,
  GridItem,
  NumberInputField,
  NumberInput,
  BoxProps,
  useToast,
  Center,
} from "@chakra-ui/react";
import circleCheckImage from "@/public/static/CircleCheck.svg";

import { PrimaryCard } from "@/layouts/PrimaryCardGrid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRequestData } from "@/hooks/useRequestData";
import { useToken } from "@/hooks/useTokenList";
import { formatTokenBalance } from "@/common/utils";
import { LinkIcon } from "@chakra-ui/icons";

const trimSchemeFromUrl = (url: string) => {
  return url.replace(/(^\w+:|^)\/\//, "");
};

const ShareRequestPage: FC = () => {
  const { query } = useRouter();
  const requestId = query.id as string;
  const toast = useToast();
  const { requestData } = useRequestData(requestId);
  const outputToken = useToken(requestData?.recipientTokenAddress, requestData?.chainId);
  const formattedOutputAmount = formatTokenBalance(requestData?.recipientTokenAmount, outputToken?.decimals, 6);

  // get url server side safe nextjs
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}/request/${requestId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);

    // show toast notification
    toast({
      title: "Link copied!",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="space-between">
      <Text textStyle="headline">Send a request.</Text>
      <Text textStyle="headline" variant="gradient" mb={6}>
        Get paid in any token.
      </Text>
      <PrimaryCard>
        <Flex alignItems="center" justifyContent="space-between" flexDirection="column" padding={4} height="100%">
          <Center flexDirection="column" width="100%" flexGrow="1">
            <Box mb={5}>
              <Image height={60} width={60} src={circleCheckImage} alt="check" />
            </Box>
            <Text textStyle="titleLg" mb={4} textAlign="center">
              Payment request link for {formattedOutputAmount} {outputToken?.symbol} has been created!
            </Text>
            <Box
              onClick={copyToClipboard}
              bg="bgSecondary"
              cursor="pointer"
              borderRadius="sm"
              py={4}
              px={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Text
                textStyle="bodyLg"
                variant="secondary"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {trimSchemeFromUrl(url)}
              </Text>
            </Box>

            <Text textStyle="bodySm" color="textTertiary" mt={4}>
              Copy the link and share it with anyone
            </Text>
          </Center>
          <Button width="100%" colorScheme="brand" size="lg" onClick={copyToClipboard} leftIcon={<LinkIcon />}>
            Copy
          </Button>
        </Flex>
      </PrimaryCard>
    </Flex>
  );
};

export default ShareRequestPage;
