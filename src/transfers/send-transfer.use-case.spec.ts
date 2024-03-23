import { IUserRepository } from 'src/users/UserRepository';
import { UserType } from '../users/User';
import { createFakeUser } from '../users/mocks/UserMock';
import { SendTransferUseCase } from './send-transfer.use-case';
import { UserRepositoryFake } from '../users/user.repository.fake';

describe('send-transfer-use-case', () => {
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

    const transferUseCase = new SendTransferUseCase(useRepo);

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

    const transferUseCase = new SendTransferUseCase(useRepo);

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

    const transferUseCase = new SendTransferUseCase(useRepo);

    const transfer = await transferUseCase.sendTranfer({
      amount: 10,
      receiver: users[1].id,
      sender: users[0].id,
    });

    expect(transfer.isFailure).toBeTruthy();

    expect(transfer.error).toBe('Saldo insuficiente');

    expect(spyUpdate).not.toHaveBeenCalled();
  });
});
