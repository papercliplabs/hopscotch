import {
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Avatar,
  Tag,
  Center,
  useTheme,
} from "@chakra-ui/react";


const SiteContainer = ({ children }) => {
  return (
    <Center width="100vw" height="100vh" backgroundColor="gray.100">
      <Container centerContent>{children}</Container>
    </Center>
  );
};

const OnNetwork = () => {
  return (
    <Tag size="lg" colorScheme="gray" borderRadius="full" width="100%" p={1}>
      <Avatar size="sm" name="USDC" my={2} mx={3} bg="blue.500" color="white" />
      <Center width="100%">
        <Heading size="sm" color="gray.500">
          USDC on Arbitrum
        </Heading>
      </Center>
    </Tag>
  );
};

const Card = ({ children }) => {
  const theme = useTheme()
  console.log('THEM', {theme});
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      boxShadow="lg"
      padding={6}
      borderRadius="md"
      backgroundColor="white"
      minWidth="335px"
    >
      {children}
    </Flex>
  );
};

const PayCardDemo = () => {
  return (
    <Card>
      <Avatar size="lg" name="Spencer Perkins" mb={4} />
      <Heading size="md" mb={1}>
        spencerperkins.eth
      </Heading>
      <Heading size="sm" color="gray.500" mb={10}>
        requested
      </Heading>
      <Heading size="2xl" mb={4}>
        1,000
      </Heading>
      <OnNetwork />
      <Button
        colorScheme="blackWhite"
        size="lg"
        width="100%"
        mt={10}
        mb={4}
      >
        Pay
      </Button>
      <Text size="sm" color="gray.500">
        Powered by 1inch
      </Text>
    </Card>
  );
};

const ChakraApp = (pageProps) => {
  return (
    <SiteContainer>
      <PayCardDemo />
    </SiteContainer>
  );
};

export default ChakraApp;
