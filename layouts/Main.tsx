import { Avatar, Center, Container, Flex, Heading, Tag, TagLabel } from "@chakra-ui/react"
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useAuth } from "@/providers/auth";

const AccountMenu = (props) => {
  const {user, logout} = props;
  const address = user?.public_key;
  const truncatedAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  return (
    <Tag size="lg" colorScheme="gray" borderRadius="full" p={1}>
      <TagLabel fontWeight="bold" ml={3}>
        {truncatedAddress}
      </TagLabel>
      <Avatar size="sm" name="?" my={2} mx={3} />
    </Tag>
  );
}

export const MainLayout = (props) => {
  const {children} = props;
  const { user, logout } = useAuth();
  return (
    <>
      <Flex
        as="header"
        w="100%"
        py={5}
        px={7}
        justifyContent="flex-end"
      >
        {
          !!user
            ? <AccountMenu logout={logout} user={user}/>
            : <ConnectWalletButton />
        }

      </Flex>
      <Container as="main" mt="20">
        {children}
      </Container>
      </>
  )
}

