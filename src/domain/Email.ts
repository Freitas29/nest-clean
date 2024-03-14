import { z } from 'zod';
import ValueObject from './ValueObject';
import Result from './Result';

type EmailData = {
  email: string;
};

export default class Email extends ValueObject<EmailData> {
  private constructor(props: EmailData) {
    super(props);
  }

  static isValidEmail(email: string): boolean {
    return z.string().email().safeParse(email).success;
  }

  static create(email: string): Result<Email> {
    if (!this.isValidEmail(email)) Result.fail('Email inválido');

    return Result.ok(
      new Email({
        email: email,
      }),
    );
  }
}
