import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Button } from "@chakra-ui/react";

import { Token } from "@/common/types";

interface TokenSelectButtonProps {
    selectedToken?: Token;
    onClickCallback: () => void;
}

export default function TokenSelectButton({ selectedToken, onClickCallback }: TokenSelectButtonProps) {
    const tokenSelectButtonProps = selectedToken
        ? {
              color: "black",
              backgroundColor: "white",
              children: selectedToken.symbol,
              leftIcon: <Avatar height={8} width={8} src={selectedToken.logoURI} />,
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
