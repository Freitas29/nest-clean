import { Controller, HttpStatus, Inject, Post, Res } from '@nestjs/common';
import { CreateUserUseCase, ICreateUserUseCase } from './create-user.use-case';
import { Response } from 'express';

@Controller('users')
export class UsersControler {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: ICreateUserUseCase;

  @Post('create')
  async create(@Res() res: Response) {
    const result = await this.createUserUseCase.create({
      cpf: '213',
      email: 'arao@email.com',
      name: '',
      password: '',
    });

    if (result.isFailure) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        error: result.error,
      });
    } else {
      return res.status(HttpStatus.OK).send();
    }
  }
}
