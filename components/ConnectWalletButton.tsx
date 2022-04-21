import { Button} from "@chakra-ui/react"
import { useAuth } from "@/providers/auth";

export const ConnectWalletButton = () => {
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