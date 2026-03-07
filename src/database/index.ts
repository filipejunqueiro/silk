import { CFXCallback, CFXParameters } from "@/types";
import { Surreal } from "surrealdb";

interface DatabaseConfig {
  endpoint: string;
  namespace: string;
  database: string;
  authentication: {
    username: string;
    password: string;
  };
}

export class Database {
  private static _instance: Database | null = null;

  private static readonly _config: DatabaseConfig = {
    endpoint: GetConvar("silk_endpoint", ""),
    namespace: GetConvar("silk_namespace", ""),
    database: GetConvar("silk_database", ""),
    authentication: {
      username: GetConvar("silk_username", ""),
      password: GetConvar("silk_password", ""),
    },
  };

  private constructor(private readonly _database: Surreal) {}

  public static async getInstance(): Promise<Database> {
    if (!Database._instance) {
      const { endpoint, ...options } = Database._config;

      const db = new Surreal();
      await db.connect(endpoint, options);

      if (!db.isConnected)
        throw new Error(
          "Silk failed to initialize, if the database is running check ur connection convars...",
        );

      Database._instance = new Database(db);
    }

    return Database._instance;
  }

  private rawQuery() {
    // TODO: Impl this :D
  }

  public query(
    query: string,
    parameters: CFXParameters,
    callback: CFXCallback,
    invokingResource = GetInvokingResource(),
    isPromise?: boolean,
  ): void {
    // TODO: Impl this :D
    return;
  }

  public single(
    query: string,
    parameters: CFXParameters,
    callback: CFXCallback,
    invokingResource = GetInvokingResource(),
    isPromise?: boolean,
  ): void {
    // TODO: Impl this :D
    return;
  }

  public insert(
    query: string,
    parameters: CFXParameters,
    callback: CFXCallback,
    invokingResource = GetInvokingResource(),
    isPromise?: boolean,
  ): void {
    // TODO: Impl this :D
    return;
  }

  public update(
    query: string,
    parameters: CFXParameters,
    callback: CFXCallback,
    invokingResource = GetInvokingResource(),
    isPromise?: boolean,
  ): void {
    // TODO: Impl this :D
    return;
  }
}
