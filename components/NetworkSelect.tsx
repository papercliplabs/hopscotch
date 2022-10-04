import { Button } from "@chakra-ui/react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { SUPPORTED_CHAINS } from "@/common/constants";
import { ConnectButton, useChainModal, useRainbowKitChainsById } from "@papercliplabs/rainbowkit";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";


export const NetworkSelect = () => {
  const [chainIconUrl, setChainIconUrl] = useState("");
  const { chain: activeChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()
  const { openChainModal } = useChainModal();
  const rainbowkitChainsById = useRainbowKitChainsById();

  const rainbowKitChain = rainbowkitChainsById[activeChain?.id];

  // iconUrl is a promise so we must resolve it
  useEffect(() => { rainbowKitChain?.iconUrl?.().then(setChainIconUrl) }, [rainbowKitChain]);



  // TODO handle no active chain
  if (!activeChain) return <ConnectButton />;


  return (
    <Button
      disabled={!switchNetwork}
      onClick={(event) => openChainModal?.()}
      leftIcon={
        <Image
          src={chainIconUrl}
          alt={activeChain?.name}
          width={32}
          height={32}
          layout="fixed"
          objectFit="contain"
          className="rounded-full"
        />
      }
      rightIcon={
        <ChevronDownIcon width={6} height={6}/>
      }
      width="100%"
      bgColor="white"
      sx={{
        justifyContent: "flex-start",
        "& > :last-child": {
          marginLeft: "auto",
        },
      }}

      borderRadius="full"
      boxShadow="md"
    >
      on {activeChain?.name} Network
    </Button>)
}