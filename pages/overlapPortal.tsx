import { Box, Button, Center, Container, Flex, Grid, GridItem, Portal, useDisclosure } from "@chakra-ui/react"
import { useLayoutEffect, useRef, useState } from "react";

const MAX_MAIN_CARD_HEIGHT = "40vh"
const OverlapDemo = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
   console.log({isOpen})
  useLayoutEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
      setHeight(containerRef.current.offsetHeight);
    }
  }, [containerRef]);
  return (
    <Container width="100%" height="100vh" maxW="832px" backgroundColor="rgb(255, 0, 0, 0.2)">
    <Center height="60%" backgroundColor="rgb(0, 0, 255, 0.1)">
      <Grid
        templateColumns="1fr"
        backgroundColor="rgb(0, 0, 255, 0.1)"
        maxWidth="456px"
        height={MAX_MAIN_CARD_HEIGHT}
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
          {isOpen && <Portal containerRef={containerRef} appendToParentPortal={false}>
          <Grid
              backgroundColor="rgb(0, 255, 255, 0.1)"
              width="100%"
              templateColumns="1fr"
              templateRows="auto minmax(0, 40vh)"
              overflow="hidden"
            >
              <GridItem position="sticky">

                <Button color="red" onClick={() => onClose()}>Close</Button>
              </GridItem>
              <GridItem
                backgroundColor="rgb(255, 0, 0, 0.1)"
                overflowY="auto"

              >
                <Box backgroundColor="rgb(255, 0, 0, 0.1)">
                    width: {width}
                    height: {height}
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

          </Portal>}


        </GridItem>
        <GridItem
              backgroundColor="rgb(0, 255, 255, 0.1)"
              width="100%"
              height="fit-content"
              overflow="hidden"
              gridRowStart={1}
              gridColumnStart={1}
              zIndex={100}
              ref={containerRef}
            >
              </GridItem>
      </Grid>
    </Center>
  </Container>
  )
}
export default OverlapDemo;