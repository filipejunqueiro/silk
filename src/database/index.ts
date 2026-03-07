import { MethodArguments, DatabaseConfig, QueryType } from "@/types";
import { Result } from "@/utils/result";
import { Surreal } from "surrealdb";
import { ParseResult } from "@/utils/parseResult";
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
        const message =
          error instanceof Error ? error.message : "Unknown Error";

        throw new Error(`Database connection failed: ${message}`);
      }
    }

    return Database._instance;
  }

  /**
   * @summary Executes a SurrealQL query.
   * @returns A shaped result based on the query type.
   */
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

      return Result.success<T>(ParseResult(queryType, data) as T);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Error";

      return Result.failure<T>(message);
    }
  }

  /**
   * @summary Executes a SurrealQL query and returns all matching records.
   * @returns An array of records, or null if no records were found.
   */
  public execute<T = unknown>(args: MethodArguments): Promise<Result<T>> {
    return this.rawQuery("execute", args);
  }

  /**
   * @summary Executes a SurrealQL query and returns the first matching record.
   * @returns The first matching record, or null if no record was found.
   */
  public single<T = unknown>(args: MethodArguments): Promise<Result<T>> {
    return this.rawQuery("single", args);
  }

  /**
   * @summary Inserts a new record into the database.
   * @returns The full created record.
   */
  public insert<T = unknown>(args: MethodArguments): Promise<Result<T>> {
    return this.rawQuery("insert", args);
  }

  /**
   * @summary Updates one or more existing records in the database.
   * @returns The full updated record.
   */
  public update<T = unknown>(args: MethodArguments): Promise<Result<T>> {
    return this.rawQuery("update", args);
  }
}
