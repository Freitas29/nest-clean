export default class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string;
  private _value: T;

  private constructor(isSucces: boolean, error?: string, value?: T) {
    if (isSucces && error)
      throw new Error('Invalid operation: Cannot sucess with an error');

    if (!isSucces && !error)
      throw new Error(
        'Invalid operation: A failing needs to contain an error message',
      );

    this.isSuccess = isSucces;
    this.isFailure = !isSucces;
    this.error = error;
    this._value = value;
  }

  public getValue(): T {
    if (!this.isSuccess)
      throw new Error('Cannot retrieve the value from an error');

    return this._value;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(
    list: Result<unknown>[],
    error?: string,
  ): Result<unknown> {
    const hasSomefailure = list.some((item) => item.isFailure);

    if (hasSomefailure) return Result.fail(error);

    return Result.ok(list);
  }
}
