import { useNestedPortalRef } from "@/components/NestedPortal";
import TokenSelect from "@/components/TokenSelect";
import { Box, Button, Center, Container, Flex, Grid, GridItem, Portal, useDisclosure } from "@chakra-ui/react"
import { createContext, forwardRef, useContext, useRef, useState } from "react";
import ReactDOM from 'react-dom';

const LONG_CONTENT = Array(100).fill("LONG CONTENT").join("\n");

const HEIGHT = "60vh";
const MAX_HEGIHT = "494px";


const MainCardGrid = forwardRef(({children}, ref) => {
 return (
    <Grid
      templateColumns="1fr"
      backgroundColor="rgb(0, 0, 255, 0.1)"
      maxWidth="456px"
      height="60vh"
      width="100%"
      minH={0}
      boxShadow='dark-lg'
      borderRadius="3xl"
      templateRows={`minmax(${HEIGHT}, ${MAX_HEGIHT}) minmax(${HEIGHT}, ${MAX_HEGIHT})`}
      overflow="hidden"
      ref={ref}
      >
        {children}
      </Grid>
 )
});


const OverlapDemo = () => {
  const containerRef = useNestedPortalRef();
  const [token, setToken] = useState(null);
  return (
    <Container width="100%" height="100vh" maxW="832px" backgroundColor="rgb(255, 0, 0, 0.2)">
    <Center height="60%" backgroundColor="rgb(0, 0, 255, 0.1)">
      <MainCardGrid ref={containerRef}>
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
      </MainCardGrid>
    </Center>
  </Container>
  )
}
export default OverlapDemo;