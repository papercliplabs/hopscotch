import { FC, ReactNode, useMemo, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Box,
  BoxProps,
  Button,
  CloseButton,
  Fade,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";

import { Token } from "@/common/types";
import { useTokenList } from "@/hooks/useTokenList";
import { NestedPortal } from "./NestedPortal";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { NetworkSelect } from "./NetworkSelect";
import { formatNumber, formatTokenBalance } from "@/common/utils";
import { useChain } from "@/hooks/useChain";

const ParentOverlay: FC<BoxProps> = (props) => (
  <Box
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
    zIndex={100}
    overflow="hidden"
    bg="rgb(255, 255, 255, 1)"
    borderRadius="md"
    {...props}
  />
);

interface SlideMenuProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const SlideMenu: FC<SlideMenuProps> = ({ title, onClose, isOpen, children }) => {
  // slide in or out
  return (
    <Fade in={isOpen}>
      <ParentOverlay p={4} pointerEvents={isOpen ? "inherit" : "none"}>
        <Flex position="relative" flexDirection="row" justifyContent="center" alignItems="center" mb={4}>
          <Text textStyle="titleLg" align="center">
            {title}
          </Text>
          <CloseButton onClick={() => onClose()} position="absolute" right="0" />
        </Flex>
        {children}
      </ParentOverlay>
    </Fade>
  );
};

export default function TokenSelect({
  setToken,
  token,
  isDisabled,
  portalRef,
}: {
  token?: Token;
  setToken: (token: Token | undefined) => void;
  isDisabled: boolean;
  portalRef?: React.RefObject<HTMLDivElement>;

}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const handleSearchChange = (event: any) => setSearch(event?.target?.value);
  const activeChain = useChain();

  const tokenList = useTokenList();
  const filteredTokenList = useMemo(() => {
    let filteredTokenList = tokenList.filter((token) => token.symbol.toLowerCase().includes(search.toLowerCase()));
    filteredTokenList.sort((a, b) => {
      if (a?.balance != undefined && b.balance != undefined) {
        return a.balance.gt(b.balance) ? -1 : 1;
      } else {
        return 0;
      }
    });

    return filteredTokenList;
  }, [tokenList, search]);

  const buttonProps = token
    ? {
        color: "black",
        backgroundColor: "white",
        children: token.symbol,
        leftIcon: <Avatar height={8} width={8} src={token.logoURI} />,
        boxShadow: "md",
      }
    : {
        color: "white",
        variant: "primary",
        children: "Choose token",
      };

  const buttonItems = useMemo(() => {
    return filteredTokenList.map((tokenDetails, index) => {
      const { name, address, symbol, balance, balanceUsd, decimals, logoURI } = tokenDetails;
      const isSelected = address === token?.address;
      return (
        <Flex
          key={address}
          flexDirection="row"
          alignItems="center"
          boxSizing="border-box"
          justifyContent="space-between"
          width="100%"
          cursor="pointer"
          paddingY={2}
          paddingX={2}
          borderRadius="xs"
          backgroundColor={isSelected ? "blackAlpha.50" : "transparent"}
          _hover={{
            backgroundColor: "blackAlpha.50",
          }}
          onClick={() => {
            setToken(tokenDetails);
            onClose();
          }}
        >
          <Flex align="center">
            <Avatar height="32px" width="32px" mr={4} src={logoURI}>
              <AvatarBadge borderWidth={2}>
                <Image
                  src={activeChain?.iconUrlSync}
                  alt={activeChain?.name}
                  width="14px"
                  height="14px"
                  layout="fixed"
                  objectFit="contain"
                  className="rounded-full"
                />
              </AvatarBadge>
            </Avatar>
            <Text textStyle="titleMd">{name}</Text>
          </Flex>
          <Flex direction="column" align="end">
            <Text textStyle="bodyLg">
              {balance ? formatTokenBalance(balance, decimals, 4) : "--"} {symbol}
            </Text>
            <Text textStyle="bodyMd" variant="secondary">
              {balanceUsd != undefined ? "$" + formatNumber(balanceUsd, 2) : "--"}
            </Text>
          </Flex>
        </Flex>
      );
    });
  }, [filteredTokenList, setToken, onClose, activeChain]);

  return (
    <>
      <Button
        rightIcon={<ChevronDownIcon boxSize="24px" />}
        onClick={(e) => onOpen()}
        isDisabled={isDisabled}
        borderRadius="md"
        height="48px"
        {...buttonProps}
      />
      <Portal containerRef={portalRef}>
        <SlideMenu title="Choose Token" isOpen={isOpen} onClose={onClose}>
          <Grid templateRows="auto auto minmax(0, 1fr)" rowGap={2} width="100%"  height="calc(100% - 40px)" templateColumns="1fr">
            <GridItem>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="black" />
                </InputLeftElement>
                <Input
                  placeholder="Search token"
                  value={search}
                  onChange={handleSearchChange}
                  borderRadius="full"
                  backgroundColor="bgSecondary"
                  color="grey"
                  textStyle="titleSm"
                  fontSize="lg"
                  // fontWeight={800}
                  lineHeight="120%"
                  letterSpacing="0"
                />
              </InputGroup>
            </GridItem>
            <GridItem>
              <NetworkSelect />
            </GridItem>
            <GridItem
              flexDirection="column"
              borderRadius="lg"
              backgroundColor="bgSecondary"
              paddingY={2}
              overflowY="scroll"
              sx={{
                "scrollbar-width": "none",
              }}
            >
              <Stack width="100%" padding={2}>
                {buttonItems}
              </Stack>
            </GridItem>
          </Grid>
        </SlideMenu>
      </Portal>
    </>
  );
}
