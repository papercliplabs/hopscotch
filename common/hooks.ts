import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";

import ERC20_ABI from "../abis/erc20.json";

export function useERC20Contract(tokenAddress: string): Contract | undefined {
  const { active, account, library } = useWeb3React();

  if (active) {
    const signer = library.getSigner(account);
    return new Contract(tokenAddress, ERC20_ABI, signer);
  } else {
    return undefined;
  }
}
