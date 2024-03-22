import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserType } from './User';
import { Repository, DataSource } from 'typeorm';
import { IUserRepository } from './UserRepository';
import { createFakeUser } from './mocks/UserMock';

describe('user.repository', () => {
  let userRepository: IUserRepository;
  const saveUserMock = jest.fn();
  let userRepositoryInstance: Repository<User>;

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
    const userCreated = await createFakeUser.create();
    const result = userRepository.create(userCreated.getValue());

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

    const userCreated = await createFakeUser.create();
    const result = userRepository.create(userCreated.getValue());

    await expect(Promise.resolve(result)).resolves.toMatchObject({
      error: 'Não foi possível cadastrar o usuário',
      isFailure: true,
      isSuccess: false,
    });
  });

  it('Não deve criar dois usuário com o mesmo email', async () => {
    const userCreated = await createFakeUser.create();

    jest
      .spyOn(userRepositoryInstance, 'save')
      .mockResolvedValueOnce(userCreated.getValue());

    const response = await userRepository.create(userCreated.getValue());

    expect(response).toBeTruthy();

    jest
      .spyOn(userRepositoryInstance, 'save')
      .mockRejectedValueOnce('Error to create user');

    const otherUser = await userRepository.create(userCreated.getValue());

    expect(otherUser.isSuccess).toBeFalsy();
  });
});

describe('user.repository with db', () => {
  let connection: DataSource;

  beforeAll(async () => {
    try {
      connection = await new DataSource({
        type: 'better-sqlite3',
        database: ':memory:',
        entities: [User],
        synchronize: true,
      }).initialize();
    } catch (e) {
      console.error('fkdljasklfjdsklf', e);
    }
  });

  afterEach(async () => {
    connection.getRepository(User).clear();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('Deve impedir a inserção de um usuário com email duplicado', async () => {
    const userRepository = connection.getRepository(User);

    try {
      const user = createFakeUser.build();
      await userRepository.insert(user);
      await userRepository.insert(user);

      fail('Não deve ter dois emails cadastrados');
    } catch (error) {
      expect((error as Error).message).toContain(
        'UNIQUE constraint failed: user.email',
      );
    }
  });

  it('Deve impedir a inserção de um usuário com cpf duplicado', async () => {
    const userRepository = connection.getRepository(User);

    try {
      await userRepository.insert(
        createFakeUser.build({ document: '12', userType: UserType.Comum }),
      );
      await userRepository.insert(
        createFakeUser.build({ document: '12', userType: UserType.Comum }),
      );

      fail('Não deve ter dois emails cadastrados');
    } catch (error) {
      expect((error as Error).message).toContain(
        'UNIQUE constraint failed: user.document',
      );
    }
  });

  it('Deve criar um usuário com sucesso', async () => {
    const userRepository = connection.getRepository(User);

    const result = await userRepository.insert(createFakeUser.build());

    expect(result.identifiers).toHaveLength(1);
  });
});
