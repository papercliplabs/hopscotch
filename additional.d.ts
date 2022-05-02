declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GRAPHQL_ADMIN_API_KEY: string;
            NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
            ACTION_SECRET: string;
            JWT_SECRET: string;
            MAINNET_RPC_URL: string;
            MATIC_RPC_URL: string;
        }
    }
}

export {};
