import { useAuth } from "@/providers/auth";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Avatar, Box, Button, Center, Container, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Tag, TagLabel } from "@chakra-ui/react"
import { ElementType, FC, ReactComponentElement, ReactElement, ReactNode } from "react";
import { useAccount } from 'wagmi'

export const CustomizeRainbowDemo = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};


export const ConnectWalletButton: FC = () => {
  const { login } = useAuth();

  return (
    <Button
      colorScheme="gray"
      borderRadius="full"
      onClick={login}
    >
      🔓
    </Button>
    );
}

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
        {/* <Tag size="lg" colorScheme="gray" borderRadius="full" p={1} as={Button}>
          <TagLabel fontWeight="bold" ml={3}>
            {truncatedAddress}
          </TagLabel>
          <Avatar size="sm" name="?" my={2} mx={3} />
        </Tag> */}
        🔒
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
}

export const AuthStatusMenu: FC = () => {
  const { user, logout } = useAuth();
  const { data, isError, isLoading } = useAccount();
  const connectedAddress = data?.address;
  const currentAddress = user?.public_key;

  const isAuthenticated = currentAddress && (currentAddress === connectedAddress);

  return (
    <Box display="flex" flexDirection="row">
        <ConnectButton/>
        {
          !!user
            ? <AccountMenu logout={logout} user={user}/>
            : <ConnectWalletButton />
        }
    </Box>
  )
}