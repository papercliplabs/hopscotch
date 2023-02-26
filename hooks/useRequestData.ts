import { useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useContractRead, useSigner } from "wagmi";
import { TransactionRequest } from "@ethersproject/providers";
import { Transaction } from "@papercliplabs/rainbowkit";

import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import { useSendTransaction } from "./useSendTransaction";
import HopscotchAbi from "@/abis/hopscotch.json";

export type RequestData = {
  id: number;
  recipientAddress: string;
  recipientTokenAddress: string;
  recipientTokenAmount: BigNumber;
  paid: boolean;
};

export function useRequestData(
  chainId?: number, // TODO: make work for multi-chain
  requestId?: number
): {
  requestData?: RequestData;
  refetch: () => void;
} {
  const { data, refetch } = useContractRead({
    addressOrName: HOPSCOTCH_ADDRESS,
    contractInterface: HopscotchAbi,
    functionName: "getRequest",
    args: [requestId],
    enabled: requestId != undefined,
  });

  function refetchInternal(): void {
    refetch();
  }

  const requestData = useMemo(() => {
    let requestData: RequestData | undefined = undefined;
    if (requestId != undefined && data != undefined && data.length == 4) {
      requestData = {
        id: requestId,
        recipientAddress: data[0],
        recipientTokenAddress: data[1],
        recipientTokenAmount: data[2],
        paid: data[3],
      };
    }
    return requestData;
  }, [data]);

  console.log(requestData);

  return { requestData: requestData, refetch: refetchInternal };
}
