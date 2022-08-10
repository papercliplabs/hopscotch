import { Box, Button, Center, Container, Flex, Grid, GridItem, Portal, useDisclosure } from "@chakra-ui/react"
import { useRef } from "react";

const CardContent = ({onClose}) => {
  return (
    <Box
     position="relative"
     left={0}
     right={0}
    >
    <Grid
    backgroundColor="rgb(255, 255, 255, 1)"
    width="100%"
    height="100%"
    templateColumns="1fr"
    templateRows="auto 1fr"
    overflow="hidden"
    zIndex={100}
    // ref={containerRef}

  >

    <GridItem position="sticky">
header
<Button color="red" onClick={() => onClose()}>CLose</Button>
    </GridItem>
    <GridItem
      backgroundColor="rgb(255, 0, 0, 0.1)"
      overflow="auto"
    >
      <Box backgroundColor="rgb(255, 0, 0, 0.1)">
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
          LONG CONTENT
      </Box>
    </GridItem>
  </Grid>
  </Box>
  )
}


const OverlapDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container width="100%" height="100vh" maxW="832px" backgroundColor="rgb(255, 0, 0, 0.2)">
    <Center height="60%" backgroundColor="rgb(0, 0, 255, 0.1)">
      <Box
        backgroundColor="rgb(0, 0, 255, 0.1)"
        maxWidth="456px"
        height="40vh"
        width="100%"
        minH={0}
        boxShadow='dark-lg'
        borderRadius="3xl"
        padding={2}
        overflow="hidden"
      >
        <Box
          backgroundColor="rgb(0, 0, 255, 0.1)"
          zIndex={1}
        >
Main area
<Button color="red" onClick={() => onOpen()}>Open</Button>

        </Box>
        {isOpen && <CardContent onClose={onClose}/>}

      </Box>
    </Center>
  </Container>
  )
}
export default OverlapDemo;