import { IUserRepository } from './UserRepository';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../common/Result';
import { User } from './User';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly database: Repository<User>,
  ) {}

  async update(input: Partial<User>): Promise<Result<boolean>> {
    try {
      const result = await this.database.update(input.id, input);

      if (result.affected === 0)
        return Result.fail('Não foi possível atualizar');

      return Result.ok(true);
    } catch (e) {
      return Result.fail('Ocorreu um erro ao atualizar o usuário');
    }
  }

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
