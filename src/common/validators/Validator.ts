export interface IValidator<T = unknown> {
  isValid(value?: T): boolean;
}
