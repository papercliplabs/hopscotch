import Link from "next/link";
import { useState } from "react";
import { addApolloState, initializeApollo } from "../graphql/apollo";
import Web3 from "web3";

import Web3Modal from "web3modal";
import { responsePathAsArray } from "graphql";
import { GetUsersDocument, useGetUsersQuery, useUpsertPublicUserMutation, useValidateSignatureMutation } from "../graphql/generated/graphql";
import { JsonRpcBatchProvider } from "@ethersproject/providers";
import get from 'lodash/fp/get';
const providerOptions = {
    /* See Provider Options Section */
};

const LoginButton = () => {
    const [upsertPublicUser] = useUpsertPublicUserMutation();
    const [validateSignature] = useValidateSignatureMutation();
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
        const nonceReponse = await upsertPublicUser({variables: {publicKey: publicAddress}});
        console.log("Got noncer", { nonceReponse });
        const nonce = get('data.insert_users_one.nonce', nonceReponse)
        console.log("Got nonce", { nonce });

        // sign nonce
        const signature = await web3!.eth.personal.sign(
            nonce,
            publicAddress,
            "" // MetaMask will ignore the password argument here
        );
        console.log(signature);

        const signatureResponse = await validateSignature({variables: {signature, publicKey: publicAddress}});

        console.log("did it work?>", { signatureResponse });
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
