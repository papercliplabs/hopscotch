import { useAuth } from "@/providers/auth";
import { ConnectButton } from "@papercliplabs/rainbowkit";
import { Box, Button, ButtonProps, Flex, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FC } from "react";
import {Lock, Unlock} from "react-feather"

export const VerifyAccountButton: FC<ButtonProps> = (props) => {
  const { login } = useAuth();

  return (
    <IconButton aria-label="account menu" colorScheme="gray" borderRadius="full" {...props} onClick={login}>
      <Icon as={Unlock} />
    </IconButton>
  );
};

const AccountMenu: FC<ButtonProps> = (props) => {
  const { logout } = useAuth();

  return (
    <Menu>
      <MenuButton><IconButton aria-label="account menu" colorScheme="brand" {...props} ><Icon as={Lock} /></IconButton></MenuButton>
      <MenuList>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export const VerificationStatus: FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AccountMenu ml={2} /> : <VerifyAccountButton ml={2} />;
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
