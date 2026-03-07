type Parameters = Record<string, unknown>;

export interface MethodArguments {
  query: string;
  parameters?: Parameters;
  invokingResource: string;
}

export interface DatabaseConfig {
  endpoint: string;
  namespace: string;
  database: string;
  authentication: {
    username: string;
    password: string;
  };
}

export type QueryType = "execute" | "single" | "insert" | "update";

export type PrintType = "info" | "success" | "warning";
