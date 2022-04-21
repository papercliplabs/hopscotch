import { Button} from "@chakra-ui/react"
import { useAuth } from "@/providers/auth";
import { FC } from "react";

export const ConnectWalletButton: FC = () => {
  const { login } = useAuth();

  return (
    <Button
      colorScheme="gray"
      borderRadius="full"
      onClick={login}
    >
      Connect Wallet
    </Button>
    );
}