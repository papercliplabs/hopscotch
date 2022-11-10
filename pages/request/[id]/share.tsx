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
import Link from "next/link";
import { useChain } from "@/hooks/useChain";

const trimSchemeFromUrl = (url: string) => {
  return url.replace(/(^\w+:|^)\/\//, "");
};

const ShareRequestPage: FC = () => {
  const { query } = useRouter();
  const requestId = query.id as string;
  const toast = useToast();
  const { requestData } = useRequestData(requestId);
  const requestedChain = useChain(requestData?.chainId);

  const outputToken = useToken(requestData?.recipientTokenAddress, requestData?.chainId);
  const formattedOutputAmount = formatTokenBalance(requestData?.recipientTokenAmount, outputToken?.decimals, 6);

  // get url server side safe nextjs
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const path = `/request/${requestId}`;
  const url = `${origin}${path}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);

    // show toast notification
    toast({
      title: "Link copied!",
      duration: 5000,
      isClosable: true,
      position: "bottom",
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
            <Text textStyle="titleLg" textAlign="center" mb={2}>
              All set!
            </Text>
            <Text variant="secondary" textStyle="bodyLg" textAlign="center" mb={4}>
            Your payment request link was created for <Text fontWeight="bold">{formattedOutputAmount} {outputToken?.symbol} on {requestedChain?.name}.</Text>
            </Text>
            <Box
              bg="bgSecondary"
              borderRadius="sm"
              py={4}
              px={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Link passHref href={path}>
                <Text
                  as="a"
                  textStyle="bodyLg"
                  variant="secondary"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {trimSchemeFromUrl(url)}
                </Text>
              </Link>
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
