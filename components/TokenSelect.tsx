import { FC, ReactNode, useMemo, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Button,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
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

interface SlideMenuProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const SlideMenu: FC<SlideMenuProps> = ({ title, onClose, isOpen, children }) => {
  // slide in or out
  const transform = isOpen ? "translateY(0%)" : "translateY(100%)";
  const transition = "transform 0.25s linear";

  return (
    <Grid
      backgroundColor="rgb(255, 255, 255, 1)"
      width="100%"
      height="100%"
      templateColumns="1fr"
      templateRows="auto minmax(0, 1fr)"
      overflow="hidden"
      gridRowStart={1}
      gridColumnStart={1}
      zIndex={100}
      transition={transition}
      transform={transform}
      p={4}
      borderRadius="inherit"
    >
      <GridItem
        position="sticky"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={4}
        flexDirection="row"
      >
        <div></div>
        <Text textStyle="titleLg">{title}</Text>
        <CloseButton onClick={() => onClose()} />
      </GridItem>
      {children}
    </Grid>
  );
};

export default function TokenSelect({
  setToken,
  token,
  isDisabled,
}: {
  token?: Token;
  setToken: (token: Token | undefined) => void;
  isDisabled: boolean;
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

  console.log(tokenList);
  console.log(filteredTokenList);

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
        colorScheme: "brand",
        children: "Choose Token",
      };

  const buttonItems = useMemo(() => {
    console.log(filteredTokenList);
    return filteredTokenList.map((tokenDetails, index) => {
      const { name, address, symbol, balance, balanceUsd, decimals, logoURI } = tokenDetails;
      console.log(balanceUsd);
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
        onClick={() => onOpen()}
        isDisabled={isDisabled}
        borderRadius="md"
        height="48px"
        {...buttonProps}
      />
      <NestedPortal>
        <SlideMenu title="Choose Token" isOpen={isOpen} onClose={onClose}>
          <Grid templateRows="auto auto minmax(0, 1fr)" rowGap={2} width="100%" height="100%" templateColumns="1fr">
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
      </NestedPortal>
    </>
  );
}
