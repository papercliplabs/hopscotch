import { useContext, createContext, FC, ReactNode, useEffect } from "react";
import { useLocalStorage, deleteFromStorage, writeStorage } from "@rehooks/local-storage";

import get from "lodash/fp/get";

import { useAccount, useSignMessage } from "wagmi";

import {
  useUpsertPublicUserMutation,
  useValidateSignatureMutation,
  useGetUsersQuery,
  User,
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
  login: () => void;
  logout: () => void;
  ensureAuthenticated: () => void;
  ensureUser: () => Promise<Nullable<User>>;
};

const defaultContextValues = {
  user: null,
  token: "",
  jwtAddress: "",
  loading: false,
  connectedAddress: "",
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  ensureAuthenticated: () => {},
  ensureUser: () => new Promise<null>((resolve) => resolve(null)),
};

export const AuthContext = createContext<AuthContextType>(defaultContextValues);
export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;

  const [token] = useLocalStorage("token");
  const { data, loading, refetch: refetchUsers } = useGetUsersQuery({ skip: !token, fetchPolicy: "network-only" });
  const user = get("user[0]", data);

  const [upsertPublicUser] = useUpsertPublicUserMutation();
  const [validateSignature] = useValidateSignatureMutation();
  const { signMessageAsync } = useSignMessage();

  const { address } = useAccount();
  const connectedAddress = address;
  const jwtAddress = user?.public_key;

  const isAuthenticated = jwtAddress && jwtAddress === connectedAddress;

  useEffect(() => {
    if (token && !user && !loading) {
      deleteFromStorage("token");
    }
  });

  const authenticatePublicKey = async (publicKey: string) => {
    try {
      // get nonce
      const nonceReponse = await upsertPublicUser({
        variables: { publicKey },
      });

      const nonce = get("data.insert_user_one.nonce", nonceReponse);

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

      return accessToken;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const login = async () => {
    if (!connectedAddress) {
      console.error("No public address connected");
      return "";
    }

    return authenticatePublicKey(connectedAddress);
  };

  const logout = () => {
    clearCache();
    deleteFromStorage("token");
  };

  const ensureAuthenticated = async () => {
    if (isAuthenticated) {
      return true;
    } else {
      return await login();
    }
  };

  const ensureUser = () => {
    return new Promise<Nullable<User>>((resolve, reject) => {
      if (isAuthenticated) {
        resolve(user);
      } else {
        login()
          .then((token) => refetchUsers())
          .then(({ data }) => {
            const newUser = get("user[0]", data);
            return newUser;
          })
          .then(resolve);
      }
    });
  };

  useEffect(() => {
    // logout if address changes
    if (jwtAddress && jwtAddress !== connectedAddress) {
      logout();
    }
  }, [jwtAddress, connectedAddress]);

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
