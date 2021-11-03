import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apollo";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
    return new Web3Provider(provider);
}

export default function App({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState);

    return (
        <ApolloProvider client={apolloClient}>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Component {...pageProps} />
            </Web3ReactProvider>
        </ApolloProvider>
    );
}
