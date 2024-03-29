import Result from '../../common/Result';
import { UserType } from '../User';

export interface IDocumentHandler {
  handler(user: UserType, document: string): Result<boolean>;
  setNext(next: IDocumentHandler): IDocumentHandler;
}
