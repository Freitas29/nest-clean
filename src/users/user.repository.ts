import { IUserRepository } from './UserRepository';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './User';
import Result from './Result';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly database: Repository<User>,
  ) {}

  async create(input: User): Promise<Result<User>> {
    try {
      const user = await this.database.save(input);

      return Result.ok(user);
    } catch (e) {
      return Result.fail('Não foi possível cadastrar o usuário');
    }
  }

  async findById(id: string): Promise<Result<User>> {
    try {
      const user = await this.database.findOneOrFail({ where: { id } });

      return Result.ok(user);
    } catch (e) {
      return Result.fail('Não foi possível cadastrar o usuário');
    }
  }
}
