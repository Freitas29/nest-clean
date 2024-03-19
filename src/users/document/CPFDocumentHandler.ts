import { IValidator } from 'src/common/validators/Validator';
import { UserType } from '../User';
import { AbstractDocumentHandler } from './AbstractDocumentHandler';
import Result from '../Result';

export class CPFDocumentHandler extends AbstractDocumentHandler {
  constructor(private readonly validator: IValidator) {
    super();
  }

  handler(user: UserType, document: string): Result<boolean> {
    if (user === UserType.Comum)
      return Result.ok(this.validator.isValid(document));

    return super.handler(user, document);
  }
}
