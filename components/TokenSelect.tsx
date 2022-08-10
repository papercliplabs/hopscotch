import { useEffect, useState } from "react";
import { Avatar, Box, Button, CloseButton, Flex, Grid, GridItem, IconButton, Image, Input, List, ListIcon, ListItem, Portal, Select, Stack, Text, useDisclosure } from "@chakra-ui/react";

import { Token } from "@/common/types";
import { useTokenList } from "@/common/hooks";
import { NestedPortal } from "./NestedPortal";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { MIN_SUCCESSFUL_TX_CONFIRMATIONS, SUPPORTED_CHAINS, URLS, V3_SWAP_ROUTER_ADDRESS } from "@/common/constants";

const LONG_CONTENT = Array(100).fill("LONG CONTENT").join("\n");

const SlideMenu = ({title, onClose, isOpen, children}) => {
  // slide in or out
  const transform = isOpen ? 'translateY(0%)' : 'translateY(100%)';
  const transition = 'transform 0.25s linear';

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
            <Text fontSize="3xl">
              {title}
            </Text>
            <CloseButton onClick={() => onClose()} />

          </GridItem>
          {children}
        </Grid>
  )
}

const NetworkSelect = () => {
  const { chain: activeChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()

  return (
    <Select
      value={activeChain?.id}
      disabled={!switchNetwork}
      onChange={(event) => switchNetwork?.(parseInt(event.target.value, 10))}
    >
      {SUPPORTED_CHAINS.map(chain => <option key={chain.id} value={chain.id}>{chain.name}</option>)}
    </Select>)
}


export default function TokenSelect({
  setToken,
  token,
}: {
  token: Token | null,
  setToken: (token: Token | undefined) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [index, setIndex] = useState<number | "">("");
  const [search, setSearch] = useState("");
  const handleSearchChange = (event) => setSearch(event.target.value)

  const tokenList = useTokenList();
  const filteredTokenList = tokenList.filter((token) => token.symbol.toLowerCase().includes(search.toLowerCase()));

  // Reset selected token when token list changes
  useEffect(() => {
    setIndex("");
  }, [tokenList]);

  console.log('tokenList', {tokenList});

  const buttonProps = token ? {
    backgroundColor: "white",
    children: token.symbol,
    rightIcon: <ChevronDownIcon />,
    leftIcon: <Avatar height={8} width={8} src={token.logoURI}/>,
    onClick: () => onOpen(),
  } : {
    backgroundColor: "blue",
    children: "Choose Token",
    rightIcon: <ChevronDownIcon />,
    onClick: () => onOpen(),
  };


  return (<>
    <Button {...buttonProps} />
    <NestedPortal>
      <SlideMenu title="Choose Token" isOpen={isOpen} onClose={onClose}>
        <Grid
          templateRows="auto auto minmax(0, 1fr)"
          rowGap={2}
          width="100%"
          height="100%"
          templateColumns="1fr"
        >
        <GridItem><Input placeholder="Search" value={search} onChange={handleSearchChange}/></GridItem>
        <GridItem><NetworkSelect /></GridItem>
        <GridItem
          flexDirection="column"
          borderRadius="2xl"
          backgroundColor="#F5F5F5"
          paddingY={4}
          overflowY="scroll"
        >
          <Text fontSize="xl" mb={2} paddingX={4}>Your wallet</Text>
          <Stack width="100%">
          {
            filteredTokenList.map((tokenDetails, index) => {
              const {name, address, symbol, decimals, logoURI} = tokenDetails;
              const isSelected = address === token?.address;
              return (
                <Flex
                  key={address}
                  flexDirection="row"
                  alignItems="center"
                  width="100%"
                  cursor="pointer"
                  paddingY={2}
                  paddingX={4}
                  backgroundColor={isSelected ? "blue.500" : "transparent"}
                  _hover={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  }}
                  onClick={() => {
                    setToken(tokenDetails);
                    onClose();
                  }}
                >
                  <Avatar height={12} width={12} mr={4} src={logoURI}/>
                  <Text as="b">{symbol}</Text>
                </Flex>
              );
            })
          }
          </Stack>

        </GridItem>
        </Grid>

      </SlideMenu>
    </NestedPortal>


  </>);
}
