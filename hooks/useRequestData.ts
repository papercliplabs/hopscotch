import { Request_Status_Enum, useGetRequestQuery, useUpdateRequestStatusMutation } from "@/graphql/generated/graphql";
import { BigNumber } from "ethers";
import { useCallback, useMemo } from "react";

export type RequestData = {
  id: string;
  recipientAddress: string;
  recipientTokenAddress: string;
  recipientTokenAmount: BigNumber;
  chainId: number;
  status: Request_Status_Enum;
  transactionHash?: string;
};

/**
 * Get the request data for a request id
 * @param id id of the request
 * @returns
 *  request data: data for the request, or undefined if loading or not found (TODO: give status also)
 *  updateRequestStatus:  callback to change the request status for the request
 */
export function useRequestData(id: string): {
  requestData?: RequestData;
  updateRequestStatus: (newStatus: Request_Status_Enum) => Promise<void>;
} {
  const { data: requestQuery, loading, error, refetch } = useGetRequestQuery({ variables: { id }, skip: !id });
  const [updateRequestStatusMutation] = useUpdateRequestStatusMutation();

  const requestData = useMemo(() => {
    let ret: RequestData | undefined = undefined;

    if (requestQuery && requestQuery.request_by_pk && requestQuery.request_by_pk.owner) {
      ret = {
        id: requestQuery.request_by_pk.id,
        recipientAddress: requestQuery.request_by_pk.owner.public_key,
        recipientTokenAddress: requestQuery.request_by_pk.recipient_token_address,
        recipientTokenAmount: BigNumber.from(requestQuery.request_by_pk.recipient_token_amount),
        chainId: requestQuery.request_by_pk.chain_id,
        status: requestQuery.request_by_pk.status,
        transactionHash: requestQuery.request_by_pk.transaction_hash ?? undefined,
      };
    }

    return ret;
  }, [requestQuery]);

  const updateRequestStatus = useCallback(
    async (newStatus: Request_Status_Enum) => {
      if (id && requestData) {
        await updateRequestStatusMutation({
          variables: {
            id: id,
            status: newStatus,
          },
        });
      }
    },
    [id, requestData, updateRequestStatusMutation]
  );

  return { requestData, updateRequestStatus };
}
