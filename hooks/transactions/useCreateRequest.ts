import { useMemo } from "react";
import { BigNumber, Contract } from "ethers";
import { Address, useAccount } from "wagmi";
import { AddressZero } from "@ethersproject/constants";

import HopscotchAbi from "@/abis/hopscotch.json";
import { HOPSCOTCH_ADDRESS } from "@/common/constants";
import useSendTransaction, { SendTransactionResponse } from "./useSendTransaction";
import { getNativeTokenAddress } from "@/common/utils";
import { useChain } from "@/hooks/useChain";

export default function useCreateRequest(
    token?: Address,
    amount?: BigNumber
): SendTransactionResponse & { requestId: BigNumber | undefined } {
    const { address } = useAccount();

    const activeChain = useChain();
    const nativeTokenAddress = useMemo(() => {
        return getNativeTokenAddress(activeChain.id);
    }, [activeChain.id]);

    const [transactionRequest, enableEagerFetch] = useMemo(() => {
        const contract = new Contract(HOPSCOTCH_ADDRESS, HopscotchAbi);
        const tokenInternal = nativeTokenAddress == token || token == undefined ? AddressZero : token;
        return [
            {
                to: contract.address,
                from: address ?? AddressZero,
                data: contract.interface.encodeFunctionData("createRequest", [
                    tokenInternal,
                    amount ?? BigNumber.from("0"),
                ]),
            },
            token != undefined && amount != undefined,
        ];
    }, [address, token, amount, nativeTokenAddress]);

    const response = useSendTransaction(transactionRequest, enableEagerFetch, "Create request");

    const requestId = useMemo(() => {
        if (response?.receipt?.logs[0]?.topics[0]) {
            return BigNumber.from(response.receipt.logs[0].topics[1]);
        } else {
            return undefined;
        }
    }, [response]);

    console.log("CREATE", transactionRequest, enableEagerFetch, response);

    return { ...response, requestId };
}
