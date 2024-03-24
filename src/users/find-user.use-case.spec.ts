import { faker } from '@faker-js/faker';
import { FindUserUseCase } from './find-user.use-case';
import { createFakeUser } from './mocks/UserMock';
import { UserRepositoryFake } from './user.repository.fake';

describe('find user use case', () => {
  it('Deve retornar um usuário', async () => {
    const usersInMemory = [
      (await createFakeUser.create()).getValue(),
      (await createFakeUser.create()).getValue(),
      (await createFakeUser.create()).getValue(),
    ];

    const repo = new UserRepositoryFake(usersInMemory);
    const findUserUseCase = new FindUserUseCase(repo);

    const result = await findUserUseCase.find(usersInMemory[0].id);

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toEqual(usersInMemory[0]);
  });

  it('Não Deve retornar um usuário', async () => {
    const usersInMemory = [
      (await createFakeUser.create()).getValue(),
      (await createFakeUser.create()).getValue(),
      (await createFakeUser.create()).getValue(),
    ];

    const repo = new UserRepositoryFake(usersInMemory);
    const findUserUseCase = new FindUserUseCase(repo);

    const result = await findUserUseCase.find(faker.number.int.toString());

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe('Não foi possível encontrar');
  });
});
