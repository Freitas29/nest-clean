import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserUseCase, ICreateUserUseCase } from './create-user.use-case';
import { Response } from 'express';
import { CreateUserDTO } from './CreateUserDTO';

@Controller('users')
export class UsersControler {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: ICreateUserUseCase;

  @Post('create')
  async create(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
    const result = await this.createUserUseCase.create(createUserDTO);

    if (result.isFailure) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        error: result.error,
      });
    } else {
      return res.status(HttpStatus.OK).send(result.getValue());
    }
  }
}
