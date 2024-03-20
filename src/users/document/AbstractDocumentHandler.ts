import Result from '../../common/Result';
import { UserType } from '../User';
import { IDocumentHandler } from './DocumentHandler';

export abstract class AbstractDocumentHandler implements IDocumentHandler {
  nextHandler?: IDocumentHandler;

  handler(user: UserType, document: string): Result<boolean> {
    if (this.nextHandler) {
      return this.nextHandler.handler(user, document);
    }

    return Result.fail('Não foi possível identificar o documento');
  }
  setNext(handler: IDocumentHandler): IDocumentHandler {
    this.nextHandler = handler;

    return this.nextHandler;
  }
}
