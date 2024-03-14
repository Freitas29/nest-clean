import { z } from 'zod';
import ValueObject from './ValueObject';
import Result from './Result';

type EmailData = {
  email: string;
};

const EmailSchema = z.object({
  email: z.string().email('This is not a valid email.'),
});

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
