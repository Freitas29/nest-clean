import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './User';
import Email from './Email';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { IUserRepository } from './UserRepository';

describe('user.repository', () => {
  let userRepository: IUserRepository;
  const saveUserMock = jest.fn();
  let userRepositoryInstance: Repository<User>;

  const createFakeUser = () => ({
    cpf: '',
    email: Email.create(faker.internet.email()).getValue().props.email,
    nome: faker.internet.userName(),
    id: '',
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: 'IUserRepository',
          useClass: UserRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn((e) => e),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>('IUserRepository');
    userRepositoryInstance = module.get<Repository<User>>(
      getRepositoryToken(User),
    );

    jest.clearAllMocks();
  });

  it('Deve criar um usuário', async () => {
    const result = userRepository.create(createFakeUser());

    await expect(Promise.resolve(result)).resolves.toMatchObject({
      error: null,
      isFailure: false,
      isSuccess: true,
    });
  });

  it('Deve retornar um erro ao tentar salvar o usuário', async () => {
    saveUserMock.mockRejectedValue(new Error('create'));

    jest
      .spyOn(userRepositoryInstance, 'save')
      .mockRejectedValueOnce('Error to create user');

    const result = userRepository.create(createFakeUser());

    await expect(Promise.resolve(result)).resolves.toMatchObject({
      error: 'Não foi possível cadastrar o usuário',
      isFailure: true,
      isSuccess: false,
    });
  });

  it('Não deve criar dois usuário com o mesmo email', async () => {
    const user = User.create({
      cpf: '2323',
      email: faker.internet.email(),
      nome: '1212',
    });

    jest
      .spyOn(userRepositoryInstance, 'save')
      .mockResolvedValueOnce(user.getValue());

    const response = await userRepository.create(user.getValue());

    expect(response).toBeTruthy();

    jest
      .spyOn(userRepositoryInstance, 'save')
      .mockRejectedValueOnce('Error to create user');

    const otherUser = await userRepository.create(user.getValue());

    expect(otherUser.isSuccess).toBeFalsy();
  });
});
