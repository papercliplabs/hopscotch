import { FC, ReactNode, useMemo, useState } from "react";
import {
  Avatar,
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

import { Token } from "@/common/types";
import { useTokenList } from "@/hooks/useTokenList";
import { NestedPortal } from "./NestedPortal";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { NetworkSelect } from "./NetworkSelect";
import { formatTokenBalance } from "@/common/utils";

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
        <Text textStyle="h4">{title}</Text>
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
        rightIcon: <ChevronDownIcon />,
        leftIcon: <Avatar height={8} width={8} src={token.logoURI} />,
        onClick: () => onOpen(),
        isDisabled: isDisabled,
      }
    : {
        color: "white",
        colorScheme: "brand",
        children: "Choose Token",
        rightIcon: <ChevronDownIcon />,
        onClick: () => onOpen(),
        isDisabled: isDisabled,
      };

  const buttonItems = useMemo(() => {
    return filteredTokenList.map((tokenDetails, index) => {
      const { name, address, symbol, balance, decimals, logoURI } = tokenDetails;
      const isSelected = address === token?.address;
      return (
        <Flex
          key={address}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          cursor="pointer"
          paddingY={2}
          paddingX={4}
          backgroundColor={isSelected ? "blackAlpha.50" : "transparent"}
          _hover={{
            backgroundColor: "blackAlpha.50",
          }}
          onClick={() => {
            setToken(tokenDetails);
            onClose();
          }}
        >
          <Flex>
            <Avatar height={12} width={12} mr={4} src={logoURI} />
            <Flex direction="column">
              <Text as="b">{symbol}</Text>
              <Text>{name}</Text>
            </Flex>
          </Flex>
          <Text>{balance ? formatTokenBalance(balance, decimals, 4) : ""}</Text>
        </Flex>
      );
    });
  }, [filteredTokenList, setToken, onClose]);

  return (
    <>
      <Button {...buttonProps} />
      <NestedPortal>
        <SlideMenu title="Choose Token" isOpen={isOpen} onClose={onClose}>
          <Grid templateRows="auto auto minmax(0, 1fr)" rowGap={2} width="100%" height="100%" templateColumns="1fr">
            <GridItem>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="black" />
                </InputLeftElement>
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={handleSearchChange}
                  borderRadius="full"
                  backgroundColor="bgSecondary"
                  color="grey"
                  textStyle="h5"
                  fontSize="18px"
                  fontWeight={800}
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
              paddingY={4}
              overflowY="scroll"
            >
              <Stack width="100%">{buttonItems}</Stack>
            </GridItem>
          </Grid>
        </SlideMenu>
      </NestedPortal>
    </>
  );
}
