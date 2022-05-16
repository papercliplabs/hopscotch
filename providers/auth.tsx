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
  ensureAuthenticated: () => void,
  ensureUser: () => Promise<Nullable<Users>>,
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
  ensureAuthenticated: () => {},
  ensureUser: () => new Promise<null>((resolve) => resolve(null)),
}

export const AuthContext = createContext<AuthContextType>(defaultContextValues);
export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const {children} = props;

  const [token] = useLocalStorage('token');
  console.log('Call user', {});
  const { data, loading, refetch: refetchUsers} = useGetUsersQuery({skip: !token, fetchPolicy: 'network-only'});
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

    if (accessToken) {
      writeStorage('token', accessToken);
    }

    return accessToken;
  }


  const login = async () => {
    if (!connectedAddress) {
      console.error("No public address connected");
      return '';
    }

    return authenticatePublicKey(connectedAddress);
  };

  const logout = () => {
    clearCache();
    deleteFromStorage('token');
  };

  const ensureAuthenticated = async () => {
    if (isAuthenticated) {
      return true;
    } else {
      return await login();
    }
  }

  const ensureUser = () => {
    return new Promise<Nullable<Users>>((resolve, reject) => {
      if (isAuthenticated) {
        resolve(user)
      } else {
        login()
          .then((token) => refetchUsers())
          .then(({data}) => {
            const newUser = get('users[0]', data);
            return newUser
          }).then(resolve)
      }
    })

  }

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
        ensureAuthenticated,
        ensureUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};