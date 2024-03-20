import { UserType } from '../users/User';
import { createFakeUser } from '../users/mocks/UserMock';
import { Transfers } from './Transfers';

describe('Transfers', () => {
  it('Deve cadastrar uma transferência válida', async () => {
    const receiver = await createFakeUser.create({
      userType: UserType.Lojista,
    });
    const sender = await createFakeUser.create({ userType: UserType.Comum });

    const transfer = Transfers.execute({
      receiver: receiver.getValue(),
      sender: sender.getValue(),
    });

    expect(transfer.isSuccess).toBeTruthy();
  });

  it('Não deve cadastrar uma transferência válida quando é sender é um lojista', async () => {
    const receiver = await createFakeUser.create({
      userType: UserType.Lojista,
    });
    const sender = await createFakeUser.create({ userType: UserType.Lojista });

    const transfer = Transfers.execute({
      receiver: receiver.getValue(),
      sender: sender.getValue(),
    });

    expect(transfer.isSuccess).toBeFalsy();
    expect(transfer.error).toBe('Lojistas não podem realizar transferência');
  });
});
