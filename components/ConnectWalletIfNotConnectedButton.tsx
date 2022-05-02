import { Button } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWalletIfNotConnectedButton({
    textIfConnected,
    isDisabledIfConnected,
    onClickIfconnectedCallback,
}: {
    textIfConnected: string;
    isDisabledIfConnected: boolean;
    onClickIfconnectedCallback: () => void;
}) {
    const [{ data: account }, disconnect] = useAccount();

    return (
        <>
            {account ? (
                <Button onClick={onClickIfconnectedCallback} isDisabled={isDisabledIfConnected}>
                    {textIfConnected}
                </Button>
            ) : (
                <ConnectButton />
            )}
        </>
    );
}
