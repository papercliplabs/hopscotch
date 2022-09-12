import { useEffect, useState } from "react";
import { Avatar, Button, CloseButton, Flex, Grid, GridItem, Input, Stack, Text, useDisclosure } from "@chakra-ui/react";

import { Token } from "@/common/types";
import { useTokenList } from "@/hooks/useTokenList";
import { NestedPortal } from "./NestedPortal";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NetworkSelect } from "./NetworkSelect";

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
            <Text textStyle="h4">
              {title}
            </Text>
            <CloseButton onClick={() => onClose()} />

          </GridItem>
          {children}
        </Grid>
  )
}

export default function TokenSelect({
  setToken,
  token,
}: {
  token: Token | null,
  setToken: (token: Token | undefined) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("");
  const handleSearchChange = (event) => setSearch(event.target.value)

  const tokenList = useTokenList();
  const filteredTokenList = tokenList.filter((token) => token.symbol.toLowerCase().includes(search.toLowerCase()));

  console.log('tokenList', {tokenList});

  const buttonProps = token ? {
    color: "black",
    backgroundColor: "white",
    children: token.symbol,
    rightIcon: <ChevronDownIcon />,
    leftIcon: <Avatar height={8} width={8} src={token.logoURI}/>,
    onClick: () => onOpen(),
  } : {
    color: "white",
    colorScheme: "brand",
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
