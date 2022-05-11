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


export const VerifyAccountButton: FC = () => {
  const { login } = useAuth();

  return (
    <Button
      colorScheme="gray"
      borderRadius="full"
      onClick={login}
    >
      Verify
    </Button>
    );
}

export interface AccountMenuProps {
  logout: () => void;
}

const AccountMenu: FC<AccountMenuProps> = (props) => {
  const {logout} = props;

  return (
    <Menu>
      <MenuButton>
        🔒
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
}

export const AuthStatusMenu: FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Box display="flex" flexDirection="row">
        <ConnectButton/>
        {
          isAuthenticated
            ? <AccountMenu logout={logout}/>
            : <VerifyAccountButton />
        }
    </Box>
  )
}