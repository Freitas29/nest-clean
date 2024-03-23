import { IUserRepository } from 'src/users/UserRepository';
import { User, UserType } from '../users/User';
import { createFakeUser } from '../users/mocks/UserMock';
import { Transfers } from './Transfers';
import { SendTransferUseCase } from './send-transfer.use-case';
import Result from '../common/Result';

describe('send-transfer-use-case', () => {
  let usersMocked: User[] = [];

  const userRepo: IUserRepository = {
    async create(e) {
      return Result.ok(e);
    },
    async findById(id) {
      return Result.ok(usersMocked.find((user) => user.id === id));
    },
  };

  beforeEach(() => {
    usersMocked = [];
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

    usersMocked = users;

    const transferUseCase = new SendTransferUseCase(userRepo);

    const transfer = await transferUseCase.sendTranfer({
      amount: 10,
      receiver: users[1].id,
      sender: users[0].id,
    });

    expect(transfer.isSuccess).toBeTruthy();

    const result = transfer.getValue();

    expect(result.sender.amount).toBe(90);
    expect(result.receiver.amount).toBe(30);
  });

  it.skip('Não deve realizar uma transferência de lojista para outro', async () => {
    const sender = (
      await createFakeUser.create({
        amount: 45,
        userType: UserType.Lojista,
      })
    ).getValue();

    const receiver = (
      await createFakeUser.create({ amount: 10, userType: UserType.Lojista })
    ).getValue();

    const transfer = Transfers.execute({
      amount: 20,
      receiver,
      sender: sender,
    });

    expect(transfer.isSuccess).toBeFalsy();
    expect(transfer.error).toBe('Lojistas não podem realizar transferência');
    expect(sender.amount).toBe(45);
    expect(receiver.amount).toBe(10);
  });
});
