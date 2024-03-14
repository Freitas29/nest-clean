import Result from 'src/users/Result';
import User from 'src/users/User';

export interface IUserRepository {
  create(input: User): Promise<Result<User>>;
  findById(email: string): Promise<Result<User>>;
}
