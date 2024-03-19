import { UserType } from '../User';
import Result from '../Result';

import { AbstractDocumentHandler } from './AbstractDocumentHandler';
import { IValidator } from '../../common/validators/Validator';

export class CNPJDocumentHandler extends AbstractDocumentHandler {
  constructor(private readonly validator: IValidator) {
    super();
  }

  handler(user: UserType, document: string): Result<boolean> {
    if (user === UserType.Lojista)
      return Result.ok(this.validator.isValid(document));

    return super.handler(user, document);
  }
}
