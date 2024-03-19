import { Test, TestingModule } from '@nestjs/testing';
import { UsersControler } from './users.controler';
import { CreateUserUseCase } from './create-user.use-case';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { User } from './User';
// import { SqlInMemory } from 'typeorm/driver/SqlInMemory';

describe('UsersController', () => {
  let controller: UsersControler;
  const createMock = jest.fn((value) => value);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersControler],
      providers: [
        CreateUserUseCase,
        {
          provide: CreateUserUseCase,
          useValue: {
            create: createMock,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersControler>(UsersControler);
  });

  it('Deve ter o controle declarado', () => {
    expect(controller).toBeDefined();
  });

  it('Deve detornar bad request quando há erro e a mensagem', async () => {
    const statusMock = jest.fn().mockReturnThis();
    const sendMock = jest.fn();

    const res = {
      status: statusMock,
      send: sendMock,
    } as unknown as Response;

    createMock.mockReturnValueOnce({
      isFailure: true,
      error: 'Erro to create a user',
    });

    await controller.create(
      { document: '', email: '', name: '', password: '' },
      res,
    );

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(sendMock).toHaveBeenCalledWith({ error: 'Erro to create a user' });
  });

  it('Deve detornar um usuário e ok', async () => {
    const statusMock = jest.fn().mockReturnThis();
    const sendMock = jest.fn();

    const userDTO = {
      document: '',
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    };

    const expectedUser = User.create({
      document: userDTO.document,
      email: userDTO.email,
      nome: userDTO.name,
    }).getValue();

    createMock.mockReturnValueOnce({
      isFailure: false,
      isSuccess: true,
      getValue: () => expectedUser,
    });

    const res = {
      status: statusMock,
      send: sendMock,
    } as unknown as Response;

    await controller.create(userDTO, res);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
    expect(sendMock).toHaveBeenCalledWith(expectedUser);
  });
});
