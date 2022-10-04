import { Button } from "@chakra-ui/react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { SUPPORTED_CHAINS } from "@/common/constants";
import { useChainModal } from "@papercliplabs/rainbowkit";


export const NetworkSelect = () => {
  const { chain: activeChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()
  const { openChainModal } = useChainModal();

  // log chain
  console.log({activeChain});
  return (
    <Button
      disabled={!switchNetwork}
      onClick={(event) => openChainModal?.()}
      borderRadius="full"
      boxShadow="md"
    >
      {activeChain?.name}
    </Button>)
}