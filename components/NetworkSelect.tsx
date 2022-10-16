import { Button } from "@chakra-ui/react";
import { useChainModal, useConnectModal } from "@papercliplabs/rainbowkit";
import Image from "next/image";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useActiveChain } from "@/hooks/useActiveChain";

export const NetworkSelect = () => {
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const activeChain = useActiveChain();

  return (
    <Button
      onClick={(event) => (activeChain.connected ? openChainModal?.() : openConnectModal?.())}
      leftIcon={
        <Image
          src={activeChain?.iconUrlSync}
          alt={activeChain?.name}
          width={32}
          height={32}
          layout="fixed"
          objectFit="contain"
          className="rounded-full"
        />
      }
      rightIcon={<ChevronDownIcon width={6} height={6} />}
      width="100%"
      bgColor="white"
      sx={{
        justifyContent: "flex-start",
        "& > :last-child": {
          marginLeft: "auto",
        },
      }}
      boxShadow="md"
    >
      on {activeChain?.name} Network
    </Button>
  );
};
