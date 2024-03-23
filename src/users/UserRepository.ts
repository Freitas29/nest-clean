import Result from '../common/Result';
import { User } from '../users/User';

export interface IUserRepository {
  create(input: User): Promise<Result<User>>;
  findById(id: string): Promise<Result<User>>;
}
