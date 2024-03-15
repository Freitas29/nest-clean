import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './User';
import Email from './Email';
import { faker } from '@faker-js/faker';

describe('user.repository', () => {
  let userRepository: UserRepository;
  const saveUserMock = jest.fn();

  const createFakeUser = () => ({
    cpf: '',
    email: Email.create(faker.internet.email()).getValue(),
    nome: faker.internet.userName(),
    id: '',
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: saveUserMock,
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  it('Deve criar um usuário', async () => {
    const result = userRepository.create(createFakeUser());

    await expect(Promise.resolve(result)).resolves.toEqual({
      error: null,
      isFailure: false,
      isSuccess: true,
    });
  });

  it('Deve retornar um erro ao tentar salvar o usuário', async () => {
    saveUserMock.mockRejectedValue(new Error('create'));

    const result = userRepository.create(createFakeUser());

    await expect(Promise.resolve(result)).resolves.toEqual({
      error: 'Não foi possível cadastrar o usuário',
      isFailure: true,
      isSuccess: false,
    });
  });
});
