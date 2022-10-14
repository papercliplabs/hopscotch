import { useContext, createContext, FC, ReactNode, useEffect } from "react";
import { useLocalStorage, deleteFromStorage, writeStorage } from "@rehooks/local-storage";

import get from "lodash/fp/get";

import { useAccount, useSignMessage } from "wagmi";

import {
  useUpsertPublicUserMutation,
  useValidateSignatureMutation,
  useGetUsersQuery,
  User,
  useGetUserByPublicKeyQuery,
} from "@/graphql/generated/graphql";
import { clearCache } from "@/graphql/apollo";

type Nullable<T> = T | undefined | null;

type AuthContextType = {
  user: Nullable<User>;
  token: Nullable<string>;
  jwtAddress: Nullable<string>;
  connectedAddress: Nullable<string>;
  isAuthenticated?: boolean;
  loading?: boolean;
  login: () => Promise<Nullable<string>>;
  logout: () => void;
  ensureUser: () => Promise<Nullable<string>>;
};

const defaultContextValues = {
  user: null,
  token: "",
  jwtAddress: "",
  loading: false,
  connectedAddress: "",
  isAuthenticated: false,
  login: () => new Promise<string>((resolve) => resolve("")),
  logout: () => {},
  ensureUser: () => new Promise<string>((resolve) => resolve("")),
};

export const AuthContext = createContext<AuthContextType>(defaultContextValues);
export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const { address: connectedAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [upsertPublicUser] = useUpsertPublicUserMutation();
  const [validateSignature] = useValidateSignatureMutation();
  const [token] = useLocalStorage("token");

  // Will return only user if it matches the jwt
  const { data, loading } = useGetUserByPublicKeyQuery({
    variables: { publicKey: connectedAddress ?? "" },
    skip: !token,
    fetchPolicy: "network-only",
  });
  const user = get("user[0]", data);
  const jwtAddress = user?.public_key;
  const isAuthenticated = jwtAddress == connectedAddress;

  function logout(): void {
    clearCache();
    deleteFromStorage("token");
  }

  useEffect(() => {
    if (token && !user && !loading) {
      deleteFromStorage("token");
    }
  });

  // Returns user id if sucessful
  async function authenticatePublicKey(publicKey: string): Promise<Nullable<string>> {
    try {
      // get nonce
      const upsertUserResponse = await upsertPublicUser({
        variables: { publicKey },
      });

      const nonce = get("data.insert_user_one.nonce", upsertUserResponse);

      const signature = await signMessageAsync({
        message: nonce,
      });

      const signatureResponse = await validateSignature({
        variables: { signature, publicKey },
      });

      const accessToken = get("data.validate_signature.accessToken", signatureResponse);

      if (accessToken) {
        writeStorage("token", accessToken);
      }

      return get("data.insert_user_one.id", upsertUserResponse);
    } catch (error) {
      console.error("AUTH ERROR", error);
      return undefined;
    }
  }

  async function login(): Promise<Nullable<string>> {
    if (!connectedAddress) {
      console.error("No public address connected");
      throw "ERROR: no public address connected";
    }

    return await authenticatePublicKey(connectedAddress);
  }

  async function ensureUser(): Promise<Nullable<string>> {
    if (isAuthenticated) {
      return user.id;
    } else {
      return await login();
    }
  }

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
        ensureUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
