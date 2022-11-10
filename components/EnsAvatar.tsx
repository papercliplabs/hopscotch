import { FC, useMemo, useState } from "react";
import { Text, Flex, Box, Avatar, AvatarProps, TextProps } from "@chakra-ui/react";
import { useAccount, useEnsAvatar, useEnsName, useNetwork } from "wagmi";
import { shortAddress } from "@/common/utils";
import { Length } from "@/common/types";
import DefaultAvatar from "@/public/static/DefaultAvatar.png";
import ConnectWalletAvatar from "@/public/static/ConnectWalletAvatar.png";
export const getInitials = (name: string): string => {
  // remove 0x if present
  name = name.replace(/^0x/, "");

  // get first threee letters
  const initials = name.slice(0, 3);

  return initials.toUpperCase();
};

export interface EnsAvatarProps extends AvatarProps {
  address: string;
}

export interface EnsNameProps extends TextProps {
  address: string;
}

export const EnsName: FC<EnsNameProps> = ({ address, ...props }) => {
  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  return (
    <Text textStyle="titleLg" {...props}>
      {ensName ? ensName : shortAddress(address ?? "", Length.MEDIUM)}
    </Text>
  );
};

export const EnsAvatar: FC<EnsAvatarProps> = (props) => {
  const { address, ...rest } = props;
  const { data: ensAvatarSrc } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  });

  return (
    <Avatar
      width="48px"
      height="48px"
      bg="accent.300"
      name={address}
      getInitials={getInitials}
      src={ensAvatarSrc ?? DefaultAvatar.src}
      {...rest}
    />
  );
};

export const ConnectedAvatar = () => {
  const { isConnected, address } = useAccount();

  return isConnected && address ? (
    <Flex alignItems="center" flexDirection="column" gap={2} mt={2}>
      <EnsAvatar address={address} />
      <EnsName address={address} />
    </Flex>
  ) : (
    <Flex alignItems="center" flexDirection="column" gap={2} mt={2}>
      <Avatar src={ConnectWalletAvatar.src} />
      <Text variant="tertiary" textStyle="titleLg">
        Connect a Wallet
      </Text>
    </Flex>
  );
};
