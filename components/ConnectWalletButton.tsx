import { useAuth } from "@/providers/auth";
import { ConnectButton } from "@papercliplabs/rainbowkit";
import { Box, Button, Flex, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FC } from "react";
import {Lock} from "react-feather"

export const VerifyAccountButton: FC = () => {
  const { login } = useAuth();

  return (
    <Button colorScheme="gray" borderRadius="full" onClick={login}>
      Verify
    </Button>
  );
};

const AccountMenu: FC = () => {
  const { logout } = useAuth();

  return (
    <Menu>
      <MenuButton><IconButton aria-label="account menu"><Icon as={Lock} /></IconButton></MenuButton>
      <MenuList>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export const VerificationStatus: FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AccountMenu /> : <VerifyAccountButton />;
};

export const ConnectWalletButton: FC = () => {
  const { connectedAddress } = useAuth();

  return (
    <Box display="flex" flexDirection="row">
      <ConnectButton />
      {connectedAddress ? <VerificationStatus /> : null}
    </Box>
  );
};

export default ConnectWalletButton;
