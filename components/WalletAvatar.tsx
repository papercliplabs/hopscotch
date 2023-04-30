import { Flex } from "@chakra-ui/react";
import { Address } from "wagmi";
import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { useEnsInfoOrDefaults } from "@/hooks/useEnsInfoOrDefaults";

export function WalletAvatar({ address, size }: { address?: Address; size?: number }) {
    const { backgroundImg } = useEnsInfoOrDefaults(address);

    return (
        <Flex
            width={size ? size + "px" : "100%"}
            height={size ? size + "px" : "100%"}
            bg="accent.300"
            boxShadow="defaultSm"
            background={backgroundImg}
            backgroundRepeat="no-repeat"
            backgroundSize="100%"
            borderRadius="100%"
        />
    );
}

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
    return <WalletAvatar address={address as Address} size={size} />;
};

// export const EnsAvatar: FC<EnsAvatarProps> = (props) => {
//     const { address, diameter } = props;
//     const { imageSrc } = useEnsInfo(address);

//     return (
//         <Flex
//             alignItems="center"
//             justify="center"
//             borderRadius="100%"
//             justifyContent="center"
//             userSelect="none"
//             width={diameter + "px"}
//             height={diameter + "px"}
//             flexShrink={0}
//         >
//             {imageSrc ? (
//                 <Avatar
//                     width="100%"
//                     height="100%"
//                     bg="accent.300"
//                     name={address}
//                     getInitials={getInitials}
//                     boxShadow="defaultSm"
//                     src={imageSrc}
//                 />
//             ) : (
//                 <Jazzicon diameter={diameter} seed={jsNumberForAddress(address ?? "0x")} />
//             )}
//         </Flex>
//     );
// };

// export const ConnectedAvatar = ({ diameter }: { diameter: number }) => {
//     const { isConnected, address } = useAccount();

//     return isConnected && address ? (
//         <Flex alignItems="center" flexDirection="column" gap={2} mt={2}>
//             <EnsAvatar address={address} diameter={diameter} />
//             <EnsName address={address} />
//         </Flex>
//     ) : (
//         <Flex alignItems="center" flexDirection="column" gap={2} mt={2}>
//             <Avatar boxShadow="defaultSm" src={ConnectWalletAvatar.src} />
//             <Text variant="tertiary" textStyle="titleLg">
//                 Connect a Wallet
//             </Text>
//         </Flex>
//     );
// };
