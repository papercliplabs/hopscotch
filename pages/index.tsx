import Link from "next/link";
import Web3 from "web3";
import { clearCache } from "../graphql/apollo";

import Web3Modal from "web3modal";
import { useGetCurrentUserInfoLazyQuery, useGetUsersQuery, useUpsertPublicUserMutation, useValidateSignatureMutation } from "../graphql/generated/graphql";
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
        const accessToken = get('data.validate_signature.accessToken', signatureResponse);
        localStorage.setItem('accessToken', accessToken);
        console.log("did it work?>", { accessToken });
    };
    return <button onClick={login}>Login with Metamask</button>;
};

const logout = () => {
    clearCache();
    localStorage.removeItem('accessToken')
}

const Index = () => {
    const {data: allUsersData} = useGetUsersQuery();
    const [getCurrentUserInfo, {data: userInfoData}] = useGetCurrentUserInfoLazyQuery();
    return (
        <div>
            Go to the{" "}
            <Link href="/demo">
                <a>demo</a>
            </Link>{" "}
            page.
            <LoginButton />
            <h2>Below is public user data</h2>
            <div>{JSON.stringify(allUsersData)}</div>
            <h2>Below is specifc user info</h2>
            <div>{JSON.stringify(userInfoData)}</div>
            <button onClick={() => getCurrentUserInfo()}>Fetch</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Index;
