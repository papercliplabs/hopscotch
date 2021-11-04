import Link from "next/link";
import { useState } from "react";
import { addApolloState, initializeApollo } from "../graphql/apollo";
import Web3 from "web3";

import Web3Modal from "web3modal";
import { responsePathAsArray } from "graphql";
import { GetUsersDocument, useGetUsersQuery } from "../graphql/generated/graphql";
import { JsonRpcBatchProvider } from "@ethersproject/providers";
const providerOptions = {
    /* See Provider Options Section */
};

const DisplayPublicUsers = () => {
  return (<div>todo</div>);
}

const LoginButton = () => {
    const login = async () => {
        const web3Modal = new Web3Modal({
            network: "polygon", // optional
            cacheProvider: true, // optional
            providerOptions, // required
        });

        // get account
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const publicAddress = accounts[0];
        console.log("Got address", { publicAddress });

        console.log(accounts);

        // get nonce
        const nonceReponse = await fetch("/api/auth/getNonce");
        const { nonce } = await nonceReponse.json();
        console.log("Got nonce", { nonce });

        // sign nonce
        const signature = await web3!.eth.personal.sign(
            nonce,
            publicAddress,
            "" // MetaMask will ignore the password argument here
        );
        console.log(signature);

        const validateSignatureReponse = await fetch(
            "/api/auth/validateSignature",
            {
                body: JSON.stringify({ publicAddress, signature }),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            }
        );

        const data = await validateSignatureReponse.json();
        console.log("did it work?>", { data });
    };
    return <button onClick={login}>Login with Metamask</button>;
};

const Index = () => {
    const {data} = useGetUsersQuery();

    return (
        <div>
            Go to the{" "}
            <Link href="/demo">
                <a>demo</a>
            </Link>{" "}
            page.
            <LoginButton />
            <div>{JSON.stringify(data)}</div>
        </div>
    );
};

export async function getStaticProps() {
    // Prefetch query to improve performance
    // not nessesary just a demo
    const apolloClient = initializeApollo();
    await apolloClient.query({
      query: GetUsersDocument,
    })

    return addApolloState(apolloClient, {
      props: {},
    })
}

export default Index;
