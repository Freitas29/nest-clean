import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './User';
import Email from './Email';

describe('user.repository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useClass: jest.fn(),
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('Deve criar um usuário', async () => {
    const email = Email.create('teste@email.com');

    const result = userRepository.create({
      cpf: '',
      email: email.getValue(),
      nome: '',
      id: '',
    });

    expect(result).toBe('jhfkdlsjfkl');
  });
});
