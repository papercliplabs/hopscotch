import { Select } from "@chakra-ui/react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { SUPPORTED_CHAINS } from "@/common/constants";


export const NetworkSelect = () => {
  const { chain: activeChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()

  return (
    <Select
      value={activeChain?.id}
      disabled={!switchNetwork}
      onChange={(event) => switchNetwork?.(parseInt(event.target.value, 10))}
    >
      {SUPPORTED_CHAINS.map(chain => <option key={chain.id} value={chain.id}>{chain.name}</option>)}
    </Select>)
}