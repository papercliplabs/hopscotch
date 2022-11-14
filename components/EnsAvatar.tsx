import { FC, useContext, useMemo, useState } from "react";
import { Text, Flex, Box, Avatar, AvatarProps, TextProps } from "@chakra-ui/react";
import { useAccount, useEnsAvatar, useEnsName, useNetwork } from "wagmi";
import { shortAddress } from "@/common/utils";
import { Length } from "@/common/types";
import DefaultAvatar from "@/public/static/DefaultAvatar.png";
import ConnectWalletAvatar from "@/public/static/ConnectWalletAvatar.svg";
import { AvatarContext } from "@papercliplabs/rainbowkit";
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

  const AvatarComponent = useContext(AvatarContext);

  return (
    <Flex
      alignItems="center"
      justify="center"
      borderRadius="full"
      overflow="hidden"
      justifyContent="center"
      userSelect="none"
    >
      {ensAvatarSrc ? (
        <Avatar
          width="48px"
          height="48px"
          bg="accent.300"
          name={address}
          getInitials={getInitials}
          boxShadow="xl"
          src={ensAvatarSrc ?? DefaultAvatar.src}
          {...rest}
        />
      ) : (
        // This is all that is needed in theory, but odd behavior with end image...
        // So, for now just use when ensAvatarSrc is not defined
        <AvatarComponent address={address} ensImage={ensAvatarSrc} size={48} />
      )}
    </Flex>
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
      <Avatar boxShadow="xl" src={ConnectWalletAvatar.src} />
      <Text variant="tertiary" textStyle="titleLg">
        Connect a Wallet
      </Text>
    </Flex>
  );
};
