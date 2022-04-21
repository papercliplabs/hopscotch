import { Container, Flex } from "@chakra-ui/react"
import { ConnectWalletButton } from "@/components/ConnectWalletButton";


export const MainLayout = (props) => {
  const {children} = props;
  return (
    <>
      <Flex
        as="header"
        w="100%"
        py={5}
        px={7}
        justifyContent="flex-end"
      >
        <ConnectWalletButton />
      </Flex>
      <Container as="main" mt="20">
        {children}
      </Container>
      </>
  )
}

