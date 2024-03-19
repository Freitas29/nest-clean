import { Test } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { faker } from '@faker-js/faker';
import { IUserRepository } from './UserRepository';
import Result from './Result';
import { UserType } from './User';

jest.mock('./user.repository');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

  const mockedUserRepository: IUserRepository = {
    async create() {
      return Promise.resolve(Result.ok());
    },
    async findById() {
      return Promise.resolve(Result.ok());
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('Deve criar um usuário com sucesso', async () => {
    const response = createUserUseCase.create({
      document: '',
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      userType: UserType.Comum,
    });

    await expect(Promise.resolve(response)).resolves.toEqual({
      isFailure: false,
      isSuccess: true,
      error: null,
    });
  });

  it('Não deve criar um usuário com e-mail inválido', async () => {
    const response = createUserUseCase.create({
      document: '',
      email: 'jfkldsjfkl',
      name: faker.internet.userName(),
      password: faker.internet.password(),
      userType: UserType.Comum,
    });

    await expect(Promise.resolve(response)).resolves.toEqual({
      isFailure: true,
      isSuccess: false,
      error: 'E-mail inválido',
    });
  });

  it.only('Deve retornar o erro de CPF inválido para o tipo de usuário comum ao passar vázio', async () => {
    const response = createUserUseCase.create({
      document: '',
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      userType: UserType.Comum,
    });

    await expect(Promise.resolve(response)).rejects.toEqual({
      isFailure: true,
      isSuccess: false,
      error: 'CPF inválido',
    });
  });
});
