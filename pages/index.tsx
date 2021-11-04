import Link from "next/link";
import { useState } from "react";
import { initializeApollo } from "../lib/apollo";
import Web3 from "web3";

import Web3Modal from "web3modal";
import { responsePathAsArray } from "graphql";
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
    const { viewer } = useViewerQuery().data!;
    const [newName, setNewName] = useState("");
    const [updateNameMutation] = useUpdateNameMutation();

    const onChangeName = () => {
        updateNameMutation({
            variables: {
                name: newName,
            },
            //Follow apollo suggestion to update cache
            //https://www.apollographql.com/docs/angular/features/cache-updates/#update
            update: (cache, mutationResult) => {
                const { data } = mutationResult;
                if (!data) return; // Cancel updating name in cache if no data is returned from mutation.
                // Read the data from our cache for this query.
                const { viewer } = cache.readQuery({
                    query: ViewerDocument,
                }) as ViewerQuery;
                const newViewer = { ...viewer };
                // Add our comment from the mutation to the end.
                newViewer.name = data.updateName.name;
                // Write our data back to the cache.
                cache.writeQuery({
                    query: ViewerDocument,
                    data: { viewer: newViewer },
                });
            },
        });
    };

    return (
        <div>
            You're signed in as {viewer.name} and you're {viewer.status}. Go to
            the{" "}
            <Link href="/about">
                <a>about</a>
            </Link>{" "}
            page.
            <div>
                <input
                    type="text"
                    placeholder="your new name..."
                    onChange={(e) => setNewName(e.target.value)}
                />
                <input type="button" value="change" onClick={onChangeName} />
            </div>
            <LoginButton />
        </div>
    );
};

export async function getStaticProps() {
    const apolloClient = initializeApollo();
}

export default Index;
