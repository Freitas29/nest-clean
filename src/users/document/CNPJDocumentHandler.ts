import { UserType } from '../User';
import Result from '../../common/Result';

import { AbstractDocumentHandler } from './AbstractDocumentHandler';
import { IValidator } from '../../common/validators/Validator';

export class CNPJDocumentHandler extends AbstractDocumentHandler {
  constructor(private readonly validator: IValidator) {
    super();
  }

  handler(user: UserType, document: string): Result<boolean> {
    if (user === UserType.Lojista) {
      const isValid = this.validator.isValid(document);

      if (isValid) return Result.ok(true);

      return Result.fail('CNPJ inválido');
    }

    return super.handler(user, document);
  }
}
