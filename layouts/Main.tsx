import { Avatar, Button, Center, Container, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Tag, TagLabel } from "@chakra-ui/react"
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useAuth } from "@/providers/auth";
import { FC, ReactNode } from "react";

export interface AccountMenuProps {
  user: {public_key: string, id: string};
  logout: () => void;
}

const AccountMenu: FC<AccountMenuProps> = (props) => {
  const {user, logout} = props;
  const address = user?.public_key;
  const truncatedAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  return (

    <Menu>
      <MenuButton>
        <Tag size="lg" colorScheme="gray" borderRadius="full" p={1} as={Button}>
          <TagLabel fontWeight="bold" ml={3}>
            {truncatedAddress}
          </TagLabel>
          <Avatar size="sm" name="?" my={2} mx={3} />
        </Tag>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );

}

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
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

