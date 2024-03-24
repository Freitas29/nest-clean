import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserUseCase, ICreateUserUseCase } from './create-user.use-case';
import { Response } from 'express';
import { CreateUserDTO } from './CreateUserDTO';
import { FindUserUseCase } from './find-user.use-case';
import { IFindUser } from './FindUser';

@Controller('users')
export class UsersControler {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: ICreateUserUseCase;

  @Inject(FindUserUseCase)
  private readonly findUserUseCase: IFindUser;

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

  @Get(':id')
  async findOne(@Param() params: any, @Res() res: Response) {
    const result = await this.findUserUseCase.find(params.id);

    if (result.isFailure) {
      return res.status(HttpStatus.NOT_FOUND);
    } else {
      return res.status(HttpStatus.OK).send(result.getValue());
    }
  }
}
