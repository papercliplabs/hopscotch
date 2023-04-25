import { Box, Button, Img } from "@chakra-ui/react";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useChain } from "@/hooks/useChain";

export const NetworkSelect = () => {
    const { openChainModal } = useChainModal();
    const { openConnectModal } = useConnectModal();
    const activeChain = useChain();

    return (
        <Button
            onClick={(_: any) => (activeChain.connected ? openChainModal?.() : openConnectModal?.())}
            leftIcon={<Img src={activeChain?.iconUri} alt={activeChain?.name} boxSize="24px" />}
            rightIcon={<ChevronRightIcon width={6} height={6} />}
            width="100%"
            bgColor="white"
            justifyContent="flex-start"
            border="2px solid"
            borderColor="bgSecondary"
            sx={{
                "& > :last-child": {
                    marginLeft: "auto",
                },
            }}
        >
            On {activeChain?.name} Network
        </Button>
    );
};
