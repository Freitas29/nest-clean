import { IUserRepository } from 'src/users/UserRepository';
import { UserType } from '../users/User';
import { createFakeUser } from '../users/mocks/UserMock';
import { SendTransferUseCase } from './send-transfer.use-case';
import { UserRepositoryFake } from '../users/user.repository.fake';
import { DataSource } from 'typeorm';
import { IAuthorizationTranferGateway } from './AuthorizationGateway';

describe('send-transfer-use-case', () => {
  const createDataSource = async (): Promise<DataSource> =>
    await new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      synchronize: true,
    }).initialize();

  const successAuthorization = (): IAuthorizationTranferGateway => ({
    async authorize() {
      return true;
    },
  });

  it('Deve realizar uma transferência para o lojista', async () => {
    const users = [
      (
        await createFakeUser.create({
          userType: UserType.Comum,
          amount: 100,
        })
      ).getValue(),
      (
        await createFakeUser.create({
          userType: UserType.Lojista,
          amount: 20,
        })
      ).getValue(),
    ];

    const useRepo: IUserRepository = new UserRepositoryFake(users);

    const spyUpdate = jest.spyOn(useRepo, 'update');

    const dataSource = await createDataSource();

    const transferUseCase = new SendTransferUseCase(
      useRepo,
      dataSource,
      successAuthorization(),
    );

    const transfer = await transferUseCase.sendTranfer({
      amount: 10,
      receiver: users[1].id,
      sender: users[0].id,
    });

    expect(transfer.isSuccess).toBeTruthy();

    const result = transfer.getValue();

    expect(result.sender.amount).toBe(90);
    expect(result.receiver.amount).toBe(30);
    expect(spyUpdate).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledTimes(2);

    expect(spyUpdate).toHaveBeenNthCalledWith(1, {
      ...users[0],
      amount: 90,
    });

    expect(spyUpdate).toHaveBeenNthCalledWith(2, {
      ...users[1],
      amount: 30,
    });
  });

  it('Não deve realizar uma transferência de lojista para outro', async () => {
    const users = [
      (
        await createFakeUser.create({
          userType: UserType.Lojista,
          amount: 100,
        })
      ).getValue(),
      (
        await createFakeUser.create({
          userType: UserType.Lojista,
          amount: 20,
        })
      ).getValue(),
    ];

    const useRepo: IUserRepository = new UserRepositoryFake(users);

    const spyUpdate = jest.spyOn(useRepo, 'update');

    const dataSource = await createDataSource();

    const transferUseCase = new SendTransferUseCase(
      useRepo,
      dataSource,
      successAuthorization(),
    );

    const transfer = await transferUseCase.sendTranfer({
      amount: 10,
      receiver: users[1].id,
      sender: users[0].id,
    });

    expect(transfer.isFailure).toBeTruthy();

    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('Não deve realizar uma transferência quando não tem saldo', async () => {
    const users = [
      (
        await createFakeUser.create({
          userType: UserType.Comum,
          amount: 0,
        })
      ).getValue(),
      (
        await createFakeUser.create({
          userType: UserType.Lojista,
          amount: 20,
        })
      ).getValue(),
    ];

    const useRepo: IUserRepository = new UserRepositoryFake(users);

    const spyUpdate = jest.spyOn(useRepo, 'update');
    const dataSource = await createDataSource();

    const transferUseCase = new SendTransferUseCase(
      useRepo,
      dataSource,
      successAuthorization(),
    );

    const transfer = await transferUseCase.sendTranfer({
      amount: 10,
      receiver: users[1].id,
      sender: users[0].id,
    });

    expect(transfer.isFailure).toBeTruthy();

    expect(transfer.error).toBe('Saldo insuficiente');

    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('Deve disparar rollback em caso de erro no update', async () => {
    const users = [
      (
        await createFakeUser.create({
          userType: UserType.Comum,
          amount: 100,
        })
      ).getValue(),
      (
        await createFakeUser.create({
          userType: UserType.Lojista,
          amount: 20,
        })
      ).getValue(),
    ];

    const dataSource = await createDataSource();

    const spyRoolback = jest.spyOn(
      dataSource.createQueryRunner(),
      'rollbackTransaction',
    );

    const useRepo: IUserRepository = new UserRepositoryFake(users);

    const spyUpdate = jest.spyOn(useRepo, 'update');

    const transferUseCase = new SendTransferUseCase(
      useRepo,
      dataSource,
      successAuthorization(),
    );

    jest.spyOn(useRepo, 'update').mockResolvedValueOnce({
      isFailure: true,
      error: 'Não foi possível atualizar',
      isSuccess: false,
      getValue() {
        return false;
      },
    });

    const transfer = await transferUseCase.sendTranfer({
      amount: 10,
      receiver: users[1].id,
      sender: users[0].id,
    });

    expect(transfer.isSuccess).toBeFalsy();

    expect(spyUpdate).toHaveBeenNthCalledWith(1, {
      ...users[0],
      amount: 90,
    });

    expect(spyUpdate).toHaveBeenNthCalledWith(2, {
      ...users[1],
      amount: 30,
    });

    expect(spyRoolback).toHaveBeenCalled();
  });

  it('Deve disparar rollback em caso de erro no serviço de autorização', async () => {
    const users = [
      (
        await createFakeUser.create({
          userType: UserType.Comum,
          amount: 100,
        })
      ).getValue(),
      (
        await createFakeUser.create({
          userType: UserType.Lojista,
          amount: 20,
        })
      ).getValue(),
    ];

    const dataSource = await createDataSource();

    const spyRoolback = jest.spyOn(
      dataSource.createQueryRunner(),
      'rollbackTransaction',
    );

    const useRepo: IUserRepository = new UserRepositoryFake(users);

    const spyUpdate = jest.spyOn(useRepo, 'update');

    const authFake: IAuthorizationTranferGateway = {
      async authorize() {
        return false;
      },
    };

    const spyAuth = jest.spyOn(authFake, 'authorize');

    const transferUseCase = new SendTransferUseCase(
      useRepo,
      dataSource,
      authFake,
    );

    const transfer = await transferUseCase.sendTranfer({
      amount: 10,
      receiver: users[1].id,
      sender: users[0].id,
    });

    expect(transfer.isSuccess).toBeFalsy();

    expect(spyUpdate).toHaveBeenNthCalledWith(1, {
      ...users[0],
      amount: 90,
    });

    expect(spyUpdate).toHaveBeenNthCalledWith(2, {
      ...users[1],
      amount: 30,
    });

    expect(spyAuth).toHaveBeenCalled();

    expect(spyRoolback).toHaveBeenCalled();
  });
});
