import { Box, Button, Center, Container, Flex, Grid, GridItem, Portal, useDisclosure } from "@chakra-ui/react"
import { useRef } from "react";
const OverlapDemo = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Container width="100%" height="100vh" maxW="832px" backgroundColor="rgb(255, 0, 0, 0.2)">
    <Center height="60%" backgroundColor="rgb(0, 0, 255, 0.1)">
      <Grid
        templateColumns="1fr"
        backgroundColor="rgb(0, 0, 255, 0.1)"
        maxWidth="456px"
        height="40vh"
        width="100%"
        boxShadow='dark-lg'
        borderRadius="3xl"
        padding={2}
        templateRows="40vh 40vh"
        overflow="hidden"

      >
        <GridItem
          backgroundColor="rgb(0, 0, 255, 0.1)"
          gridRowStart={1}
          gridColumnStart={1}
          zIndex={1}
        >
          <Button color="red" onClick={() => onOpen()}>Open</Button>
          {isOpen && <Portal containerRef={containerRef}>

              <GridItem position="sticky">

                <Button color="red" onClick={() => onClose()}>Close</Button>
              </GridItem>
              <GridItem
                backgroundColor="rgb(255, 0, 0, 0.1)"
                overflowY="auto"

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
                </Box>
              </GridItem>
          </Portal>}


        </GridItem>
        <Grid
              backgroundColor="rgb(0, 255, 255, 0.1)"
              width="100%"
              templateColumns="1fr"
              templateRows="auto minmax(0, 40vh)"
              overflow="hidden"
              gridRowStart={1}
              gridColumnStart={1}
              zIndex={100}
              ref={containerRef}
              height="fit-content"

            >
              </Grid>
      </Grid>
    </Center>
  </Container>
  )
}
export default OverlapDemo;