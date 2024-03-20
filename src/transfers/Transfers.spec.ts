import { UserType } from '../users/User';
import { createFakeUser } from '../users/mocks/UserMock';
import { Transfers } from './Transfers';

describe('Transfers', () => {
  it('Deve cadastrar uma transferência válida', async () => {
    const receiver = await createFakeUser.create({
      userType: UserType.Lojista,
    });
    const sender = await createFakeUser.create({ userType: UserType.Comum });

    const transfer = new Transfers({
      receiver: receiver.getValue(),
      sender: sender.getValue(),
    });

    expect(transfer).toBeInstanceOf(Transfers);
  });

  it('Não deve cadastrar uma transferência válida quando é sender é um lojista', async () => {
    const receiver = await createFakeUser.create({
      userType: UserType.Lojista,
    });
    const sender = await createFakeUser.create({ userType: UserType.Lojista });

    const transfer = () =>
      new Transfers({
        receiver: receiver.getValue(),
        sender: sender.getValue(),
      });

    expect(transfer).toThrow('Lojistas não podem realizar transferência');
  });
});
