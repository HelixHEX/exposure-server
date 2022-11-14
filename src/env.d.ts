declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
