import { Test } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { faker } from '@faker-js/faker';
import { IUserRepository } from './UserRepository';
import Result from '../common/Result';
import { UserType } from './User';

jest.mock('./user.repository');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  const CNPJ_VALIDO = '80006940000127';
  const CPF_VALIDO = '23671568089';

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
      document: CPF_VALIDO,
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

  it('Deve retornar o erro de CPF inválido para o tipo de usuário comum ao passar vázio', async () => {
    const response = createUserUseCase.create({
      document: '',
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      userType: UserType.Comum,
    });

    await expect(Promise.resolve(response)).resolves.toMatchObject({
      isFailure: true,
      isSuccess: false,
      error: 'CPF inválido',
    });
  });

  it('Deve retornar o erro de CNPJ inválido para o tipo de usuário lojista ao passar vázio', async () => {
    const response = createUserUseCase.create({
      document: CPF_VALIDO,
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      userType: UserType.Lojista,
    });

    await expect(Promise.resolve(response)).resolves.toMatchObject({
      isFailure: true,
      isSuccess: false,
      error: 'CNPJ inválido',
    });
  });

  it('Deve retornar o erro de CPF inválido para o tipo de usuário comum ao passar vázio', async () => {
    const response = createUserUseCase.create({
      document: CNPJ_VALIDO,
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      userType: UserType.Comum,
    });

    await expect(Promise.resolve(response)).resolves.toMatchObject({
      isFailure: true,
      isSuccess: false,
      error: 'CPF inválido',
    });
  });
});
