import Result from 'src';
import { User } from 'src/users/User';

export interface IUserRepository {
  create(input: User): Promise<Result<User>>;
  findById(email: string): Promise<Result<User>>;
}
