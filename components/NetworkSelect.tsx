import { Box, Button } from "@chakra-ui/react";
import { useChainModal, useConnectModal } from "@papercliplabs/rainbowkit";
import Image from "next/image";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useChain } from "@/hooks/useChain";

export const NetworkSelect = () => {
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const activeChain = useChain();

  return (
    <Button
      onClick={(_) => (activeChain.connected ? openChainModal?.() : openConnectModal?.())}
      leftIcon={
        <Image
          src={activeChain?.iconUrlSync}
          alt={activeChain?.name}
          width={24}
          height={24}
          layout="fixed"
          objectFit="contain"
          className="rounded-full"
        />
      }
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
