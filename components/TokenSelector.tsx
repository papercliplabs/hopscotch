import { useState } from "react";
import { Select } from "@chakra-ui/react";

import { Token } from "@/common/types";
import { SupportedChainId } from "@/common/enums";
import { useTokenList } from "@/common/hooks";

export default function TokenSelector({
    chainId,
    selectedTokenCallback,
}: {
    chainId: SupportedChainId;
    selectedTokenCallback: (token: Token | undefined) => void;
}) {
    const tokenList = useTokenList(chainId);

    return (
        <Select
            onChange={(e) => {
                const newToken = tokenList[parseInt(e.target.value)];
                selectedTokenCallback(newToken);
            }}
            placeholder="Select token"
        >
            {tokenList.map((token, i) => {
                return (
                    <option value={i}>
                        {/* {<img src={token.logoURI} alt="Dan Abramov" />} */}
                        {token.symbol}
                    </option>
                );
            })}
        </Select>
    );
}
