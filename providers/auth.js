import { useState, useEffect, useContext, createContext } from 'react';
import { useLocalStorage, deleteFromStorage, writeStorage } from '@rehooks/local-storage';

import Web3Modal from "web3modal";
import Web3 from "web3";
import get from "lodash/fp/get";

import {
  useUpsertPublicUserMutation,
  useValidateSignatureMutation,
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { clearCache } from "@/graphql/apollo";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const providerOptions = {
  /* See Provider Options Section */
};

export const AuthProvider = (props) => {
  const {children} = props;

  const [token] = useLocalStorage('token');
  const { data, loading } = useGetUsersQuery({skip: !token});
  const user = get('users[0]', data);

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
    const nonceReponse = await upsertPublicUser({
      variables: { publicKey: publicAddress },
    });
    console.log("Got noncer", { nonceReponse });
    const nonce = get("data.insert_users_one.nonce", nonceReponse);
    console.log("Got nonce", { nonce });

    // sign nonce
    const signature = await web3.eth.personal.sign(
      nonce,
      publicAddress,
      "" // MetaMask will ignore the password argument here
    );
    console.log(signature);

    const signatureResponse = await validateSignature({
      variables: { signature, publicKey: publicAddress },
    });

    const accessToken = get(
      "data.validate_signature.accessToken",
      signatureResponse
    );

    if (accessToken) {
      writeStorage('token', accessToken);
    }
  };

  const logout = () => {
    clearCache();
    deleteFromStorage('token');
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        user,
        token,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};