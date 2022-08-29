import { useNestedPortalRef } from "@/components/NestedPortal";
import TokenSelect from "@/components/TokenSelect";
import { PrimaryCardGrid } from "@/layouts/PrimaryCardGrid";
import { Box, Button, Center, Container, Flex, Grid, GridItem, Portal, useDisclosure } from "@chakra-ui/react"
import {  useState } from "react";
import ReactDOM from 'react-dom';

const LONG_CONTENT = Array(100).fill("LONG CONTENT").join("\n");




const OverlapDemo = () => {
  const [token, setToken] = useState(null);
  return (
    <Container width="100%" height="100vh" maxW="832px" backgroundColor="rgb(255, 0, 0, 0.2)">
    <Center height="60%" backgroundColor="rgb(0, 0, 255, 0.1)">
      <PrimaryCardGrid>
        <GridItem
          backgroundColor="rgb(0, 0, 255, 0.1)"
          gridRowStart={1}
          gridColumnStart={1}
          zIndex={1}
          height="100%"
          margin={4}
        >
<TokenSelect setToken={setToken} token={token}/>
{LONG_CONTENT}

        </GridItem>
      </PrimaryCardGrid>
    </Center>
  </Container>
  )
}
export default OverlapDemo;