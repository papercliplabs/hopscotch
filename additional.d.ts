declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GRAPHQL_ADMIN_API_KEY: string;
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
      ACTION_SECRET: string;
      JWT_SECRET: string;
    }
  }
}

export {}
