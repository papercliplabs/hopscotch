import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Button } from "@chakra-ui/react";

import { Token } from "@/common/types";
import TokenWithChainIcon from "./TokenWithChainIcon"
import { UseChain, useChain } from "@/hooks/useChain";

interface TokenSelectButtonProps {
    selectedToken?: Token;
    customChain?: UseChain;
    onClickCallback: () => void;
}

export default function TokenSelectButton({ selectedToken, customChain, onClickCallback }: TokenSelectButtonProps) {
    const activeChain = useChain();
    const chain = customChain ?? activeChain;

    const tokenSelectButtonProps = selectedToken
        ? {
              color: "black",
              backgroundColor: "white",
              children: selectedToken.symbol,
              leftIcon: <TokenWithChainIcon token={selectedToken} chain={chain} size={32} />,
              boxShadow: "md",
          }
        : {
              color: "white",
              variant: "primary",
              children: "Choose token",
          };

    return (
        <Button
            rightIcon={<ChevronDownIcon boxSize="24px" />}
            onClick={() => onClickCallback()}
            borderRadius="md"
            height="48px"
            maxWidth="175px"
            {...tokenSelectButtonProps}
        />
    );
}
