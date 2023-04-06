declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ACTION_SECRET: string;
            JWT_SECRET: string;
            NEXT_PUBLIC_ALCHEMY_ID: string;
        }
    }
}

export {};
