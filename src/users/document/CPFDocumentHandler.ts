import { IValidator } from 'src/common/validators/Validator';
import { UserType } from '../User';
import { AbstractDocumentHandler } from './AbstractDocumentHandler';
import Result from '../Result';

export class CPFDocumentHandler extends AbstractDocumentHandler {
  constructor(private readonly validator: IValidator) {
    super();
  }

  handler(user: UserType, document: string): Result<boolean> {
    if (user === UserType.Comum) {
      const isValid = this.validator.isValid(document);

      if (isValid) return Result.ok(true);

      return Result.fail('CPF inválido');
    }

    return super.handler(user, document);
  }
}
