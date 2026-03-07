export class Result<T> {
  private constructor(
    public readonly data: T | null,
    public readonly isSuccess: boolean,
    public readonly error: string | null,
  ) {}

  public static success<T>(data: T): Result<T> {
    return new Result<T>(data, true, null);
  }

  public static failure<T>(error: string): Result<T> {
    return new Result<T>(null, false, error);
  }
}
