import { Box, Button, Center, Container, Flex, Grid, GridItem, keyframes, Portal, useDisclosure } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';

const LONG_CONTENT = Array(100).fill("LONG CONTENT").join("\n");

const MyPortal = ({containerRef, children}) => {
  // get the portal container ref from the parent component
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    // Force a rerender, so it can be passed to the child.
    // If this causes an unwanted flicker, use useLayoutEffect instead
    setElement(containerRef.current);
  }, [containerRef]);

  if (element == null) {
    return null;
  }

  return ReactDOM.createPortal(children, element);
}


const ModalContent = ({onClose, isOpen}) => {
  // slide in or out
  const transform = isOpen ? 'translateY(0%)' : 'translateY(100%)';
  const transition = isOpen ? 'transform 0.25s linear' : 'transform 0.25s linear';
  return (
        <Grid
          backgroundColor="rgb(255, 255, 255, 1)"
          width="100%"
          templateColumns="1fr"
          templateRows="auto 1fr"
          overflow="hidden"
          gridRowStart={1}
          gridColumnStart={1}
          zIndex={100}
          transition={transition}
          transform={transform}
        >

          <GridItem position="sticky">
header
<Button color="red" onClick={() => onClose()}>Close</Button>

          </GridItem>
          <GridItem
            backgroundColor="rgb(255, 0, 0, 0.1)"
            overflow="auto"

          >
            <Box backgroundColor="rgb(255, 0, 0, 0.1)">
                {LONG_CONTENT}
            </Box>
          </GridItem>
        </Grid>
  )
}

const OverlapDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container width="100%" height="100vh" maxW="832px" backgroundColor="rgb(255, 0, 0, 0.2)">
    <Center height="60%" backgroundColor="rgb(0, 0, 255, 0.1)">
      <Grid
        templateColumns="1fr"
        backgroundColor="rgb(0, 0, 255, 0.1)"
        maxWidth="456px"
        height="40vh"
        width="100%"
        minH={0}
        boxShadow='dark-lg'
        borderRadius="3xl"
        padding={2}
        templateRows="40vh 40vh"
        overflow="hidden"
        ref={containerRef}
      >
        <GridItem
          backgroundColor="rgb(0, 0, 255, 0.1)"
          gridRowStart={1}
          gridColumnStart={1}
          zIndex={1}
          overflow="auto"
        >
<Button color="red" onClick={() => onOpen()}>Open</Button>
<MyPortal containerRef={containerRef}>
        <ModalContent isOpen={isOpen} onClose={onClose}/>
        </MyPortal>
1
{LONG_CONTENT}

        </GridItem>
      </Grid>
    </Center>
  </Container>
  )
}
export default OverlapDemo;