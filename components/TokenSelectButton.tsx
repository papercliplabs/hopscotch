import { Button } from "@chakra-ui/react";

import { Token } from "@/common/types";
import TokenWithChainIcon from "./TokenWithChainIcon";
import { useChain } from "@/hooks/useChain";
import { CaretDown } from "@phosphor-icons/react";

interface TokenSelectButtonProps {
    selectedToken?: Token;
    onClickCallback: () => void;
}

export default function TokenSelectButton({ selectedToken, onClickCallback }: TokenSelectButtonProps) {
    const chain = useChain(selectedToken?.chainId);
    const tokenSelectButtonProps = selectedToken
        ? {
              color: "black",
              backgroundColor: "white",
              children: selectedToken.symbol,
              leftIcon: <TokenWithChainIcon token={selectedToken} chain={chain} size={32} />,
              boxShadow: "md",
              pl: "8px",
          }
        : {
              color: "white",
              variant: "primary",
              children: "Choose token",
              pl: "16px",
          };
    return (
        <Button
            rightIcon={<CaretDown size={24} weight="bold" />}
            onClick={() => onClickCallback()}
            borderRadius="md"
            height="48px"
            size="lg"
            maxWidth="175px"
            pr="16px"
            {...tokenSelectButtonProps}
        />
    );
}
