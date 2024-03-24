import { CreateUserDTO } from './CreateUserDTO';
import Result from '../common/Result';
import { User } from './User';
import { IUserRepository } from './UserRepository';
import { Inject, Injectable } from '@nestjs/common';

export interface ICreateUserUseCase {
  create(input: CreateUserDTO): Promise<Result<User>>;
}

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  @Inject('IUserRepository')
  private readonly userRepo: IUserRepository;

  async create(input: CreateUserDTO): Promise<Result<User>> {
    const user = User.create({
      document: input.document,
      email: input.email,
      nome: input.name,
      userType: input.userType,
      amount: input.amount,
    });

    if (user.isFailure) return Result.fail(user.error);

    const isDocumentValid = user.getValue().isValidDocument();

    if (isDocumentValid.isFailure) return Result.fail(isDocumentValid.error);

    if (!isDocumentValid.getValue()) return Result.fail(isDocumentValid.error);

    const response = await this.userRepo.create(user.getValue());

    if (response.isFailure) return Result.fail(response.error);

    return Result.ok(response.getValue());
  }
}
