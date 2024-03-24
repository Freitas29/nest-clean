import { Inject, Injectable } from '@nestjs/common';
import { IFindUser } from './FindUser';
import { IUserRepository } from './UserRepository';
import Result from '../common/Result';
import { User } from './User';

@Injectable()
export class FindUserUseCase implements IFindUser {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async find(id: string): Promise<Result<User>> {
    const user = await this.userRepo.findById(id);

    if (user.isFailure) return Result.fail(user.error);

    return Result.ok(user.getValue());
  }
}
