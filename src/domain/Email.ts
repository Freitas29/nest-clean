import ValueObject from './ValueObject';
import Result from './Result';
import { EmailSchema } from './EmailValidation';

type EmailData = {
  email: string;
};

export default class Email extends ValueObject<EmailData> {
  private constructor(props: EmailData) {
    super(props);
  }

  static isValidEmail(email: string): boolean {
    return EmailSchema.safeParse({ email }).success;
  }

  static create(email: string): Result<Email> {
    if (!this.isValidEmail(email)) return Result.fail('E-mail inválido');

    return Result.ok(
      new Email({
        email: email,
      }),
    );
  }
}
