import { useAuth } from "@/providers/auth";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FC } from "react";

// const ConnectButton = dynamic(() => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton as any), {ssr: false, loading: () => <p>THE FUCK</p>})

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
      <MenuButton>🔒</MenuButton>
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
  console.log({connectedAddress})
  return (
    <Box display="flex" flexDirection="row">
      <ConnectButton />
      {connectedAddress ? <VerificationStatus /> : null}
    </Box>
  );
};

export default ConnectWalletButton;
