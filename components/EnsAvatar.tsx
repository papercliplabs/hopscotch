import { FC, useMemo } from "react";
import { Text, Flex, Avatar, AvatarProps, TextProps } from "@chakra-ui/react";
import { Address, useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { shortAddress } from "@/common/utils";
import { Length } from "@/common/types";
import ConnectWalletAvatar from "@/public/static/ConnectWalletAvatar.svg";
import { emojiAvatarForAddress } from "@papercliplabs/rainbowkit";

export const getInitials = (name: string): string => {
    // remove 0x if present
    name = name.replace(/^0x/, "");

    // get first three letters
    const initials = name.slice(0, 3);

    return initials.toUpperCase();
};

export interface EnsAvatarProps extends AvatarProps {
    address?: Address;
}

export interface EnsNameProps extends TextProps {
    address: Address;
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
        address: address,
        chainId: 1,
    });

    const { color: backgroundColor, emoji } = useMemo(() => emojiAvatarForAddress(address ?? ""), [address]);

    return (
        <Flex
            alignItems="center"
            justify="center"
            borderRadius="100%"
            justifyContent="center"
            userSelect="none"
            width="46px"
            height="46px"
            flexShrink={0}
            backgroundColor={backgroundColor}
            {...rest}
        >
            {ensAvatarSrc ? (
                <Avatar
                    width="100%"
                    height="100%"
                    bg="accent.300"
                    name={address}
                    getInitials={getInitials}
                    boxShadow="defaultSm"
                    src={ensAvatarSrc}
                />
            ) : (
                <>{emoji}</>
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
            <Avatar boxShadow="defaultSm" src={ConnectWalletAvatar.src} />
            <Text variant="tertiary" textStyle="titleLg">
                Connect a Wallet
            </Text>
        </Flex>
    );
};
