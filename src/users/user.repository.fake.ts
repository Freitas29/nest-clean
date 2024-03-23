import { IUserRepository } from './UserRepository';
import { Injectable } from '@nestjs/common';
import Result from '../common/Result';
import { User } from './User';

@Injectable()
export class UserRepositoryFake implements IUserRepository {
  private dbMemory: User[] = [];

  constructor(db: User[] = []) {
    this.dbMemory = db;
  }

  async update(input: Partial<User>): Promise<Result<boolean>> {
    const result = this.dbMemory.map((user) => {
      if (user.id !== input.id) return user;

      return User.create({ ...user, ...input }).getValue();
    });

    this.dbMemory = result;

    return Result.ok(true);
  }

  async create(input: User): Promise<Result<User>> {
    this.dbMemory.push(input);

    return Result.ok(input);
  }

  async findById(id: string): Promise<Result<User>> {
    return Result.ok(this.dbMemory.find((user) => user.id === id));
  }
}
