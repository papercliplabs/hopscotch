import { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";

import { Token } from "@/common/types";
import { useTokenList } from "@/hooks/useTokenList";

export default function TokenSelector({
  selectedTokenCallback,
}: {
  selectedTokenCallback: (token: Token | undefined) => void;
}) {
  const [index, setIndex] = useState<number | "">("");
  const tokenList = useTokenList();

  // Reset selected token when token list changes
  useEffect(() => {
    setIndex("");
  }, [tokenList]);

  return (
    <Select
      onChange={(e) => {
        const newIndex = parseInt(e.target.value);
        if (isNaN(newIndex)) {
          setIndex("");
          selectedTokenCallback(undefined);
        } else {
          const newToken = tokenList[newIndex];
          setIndex(newIndex);
          selectedTokenCallback(newToken);
        }
      }}
      placeholder="Choose token"
      variant="filled"
      backgroundColor="bg0"
      size="lg"
      value={index}
    >
      {tokenList.map((token, i) => {
        return (
          <option value={i} key={i}>
            {/* {<img src={token.logoURI} alt="Dan Abramov" />} */}
            {token.symbol}
          </option>
        );
      })}
    </Select>
  );
}
