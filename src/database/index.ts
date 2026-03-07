import { MethodArguments, DatabaseConfig, QueryType } from "@/types";
import { Result } from "@/utils/result";
import { Surreal } from "surrealdb";
import { ParseResponse } from "@/utils/parseResponse";
import { Print } from "@/utils/print";

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

      try {
        const db = new Surreal();
        await db.connect(endpoint, options);

        if (!db.isConnected)
          throw new Error(
            "Silk failed to initialize, if the database is running check ur connection convars...",
          );

        Database._instance = new Database(db);

        Print.write("Database connection established!", "success");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknow Error";

        throw new Error(`Database connection failed: ${message}`);
      }
    }

    return Database._instance;
  }

  private async rawQuery<T>(
    queryType: QueryType,
    {
      query,
      parameters = {},
      invokingResource = GetInvokingResource(),
    }: MethodArguments,
  ): Promise<Result<T>> {
    try {
      const [data] = await this._database.query(query, parameters).collect();

      return Result.success<T>(ParseResponse(queryType, data) as T);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknow Error";

      return Result.failure<T>(message);
    }
  }

  public execute(args: MethodArguments): Promise<Result<unknown>> {
    return this.rawQuery("execute", args);
  }

  public single(args: MethodArguments): Promise<Result<unknown>> {
    return this.rawQuery("single", args);
  }

  public insert(args: MethodArguments): Promise<Result<unknown>> {
    return this.rawQuery("insert", args);
  }

  public update(args: MethodArguments): Promise<Result<unknown>> {
    return this.rawQuery("update", args);
  }
}
