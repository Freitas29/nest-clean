import Result from '../common/Result';
import { User } from './User';

export interface IFindUser {
  find(id: string): Promise<Result<User>>;
}
