import { Button } from "@chakra-ui/react";

import { Token } from "@/common/types";
import TokenWithChainIcon from "./TokenWithChainIcon";
import { useChain } from "@/hooks/useChain";
import { CaretDown } from "@phosphor-icons/react";
import { motion } from "framer-motion";

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
              boxShadow: "defaultMd",
              pl: "8px",
          }
        : {
              color: "white",
              variant: "primary",
              children: "Choose token",
              pl: "16px",
          };
    return (
        <motion.div
            animate={{ scale: [1, selectedToken ? 1 : 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <Button
                rightIcon={<CaretDown size={24} weight="bold" />}
                onClick={() => onClickCallback()}
                borderRadius="md"
                height="48px"
                size={["sm", "lg"]}
                maxWidth="175px"
                minHeight="50px"
                pr="16px"
                {...tokenSelectButtonProps}
            />
        </motion.div>
    );
}
