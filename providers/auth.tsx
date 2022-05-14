import { useContext, createContext, FC, ReactNode, useEffect } from 'react';
import { useLocalStorage, deleteFromStorage, writeStorage } from '@rehooks/local-storage';

import get from "lodash/fp/get";

import { useAccount, useSignMessage } from 'wagmi'

import {
  useUpsertPublicUserMutation,
  useValidateSignatureMutation,
  useGetUsersQuery,
  Users
} from "@/graphql/generated/graphql";
import { clearCache } from "@/graphql/apollo";

type Nullable<T> = T | undefined | null;


type AuthContextType = {
  user: Nullable<Users>,
  token: Nullable<string>,
  jwtAddress: Nullable<string>,
  connectedAddress: Nullable<string>,
  isAuthenticated?: boolean,
  loading?: boolean,
  login: () => void,
  logout: () => void,
};

const defaultContextValues = {
  user: null,
  token: '',
  jwtAddress: '',
  loading: false,
  connectedAddress: '',
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
}

export const AuthContext = createContext<AuthContextType>(defaultContextValues);
export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const {children} = props;

  const [token] = useLocalStorage('token');
  const { data, loading } = useGetUsersQuery({skip: !token, fetchPolicy: 'network-only'});
  const user = get('users[0]', data);

  const [upsertPublicUser] = useUpsertPublicUserMutation();
  const [validateSignature] = useValidateSignatureMutation();
  const { signMessageAsync } = useSignMessage()

  const { data: localAccountData } = useAccount();
  const connectedAddress = localAccountData?.address;
  const jwtAddress = user?.public_key;

  const isAuthenticated = jwtAddress && (jwtAddress === connectedAddress);

  const authenticatePublicKey = async (publicKey: string) => {
    // get nonce
    const nonceReponse = await upsertPublicUser({
      variables: { publicKey },
    });

    const nonce = get("data.insert_users_one.nonce", nonceReponse);

    const signature = await signMessageAsync({
      message: nonce,
    });

    const signatureResponse = await validateSignature({
      variables: { signature, publicKey },
    });


    const accessToken = get(
      "data.validate_signature.accessToken",
      signatureResponse
    );

    console.log('Access token data', {publicKey, accessToken});

    if (accessToken) {
      writeStorage('token', accessToken);
    }
  }


  const login = async () => {
    if (connectedAddress) {
      authenticatePublicKey(connectedAddress);
    } else {
      console.error("No public address connected");
    }
  };

  const logout = () => {
    clearCache();
    deleteFromStorage('token');
  };

  useEffect(() => {
    // logout if address changes
    if (jwtAddress && (jwtAddress !== connectedAddress)) {
      logout()
    }
  },[jwtAddress, connectedAddress])

  return (
    <AuthContext.Provider
      value={{
        login,
        user,
        connectedAddress,
        jwtAddress,
        token: isAuthenticated ? token : null,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};