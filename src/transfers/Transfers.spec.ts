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
      amount: 0,
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
      amount: 0,
    });

    expect(transfer.isSuccess).toBeFalsy();
    expect(transfer.error).toBe('Lojistas não podem realizar transferência');
  });

  it('Não deve permitir uma transferência de um usuário com saldo menor que o valor sendo enviado', async () => {
    const receiver = await createFakeUser.create({
      userType: UserType.Lojista,
      amount: 0,
    });
    const sender = await createFakeUser.create({
      userType: UserType.Comum,
      amount: 10,
    });

    const transfer = Transfers.execute({
      receiver: receiver.getValue(),
      sender: sender.getValue(),
      amount: 15,
    });

    expect(transfer.isFailure).toBeTruthy();
    expect(transfer.error).toBe('Saldo insuficiente');
  });

  it('Deve remover o enviado do sender e adicionar no receiver', async () => {
    const receiver = await createFakeUser.create({
      userType: UserType.Lojista,
      amount: 10,
    });
    const sender = await createFakeUser.create({
      userType: UserType.Comum,
      amount: 50,
    });

    const transfer = Transfers.execute({
      receiver: receiver.getValue(),
      sender: sender.getValue(),
      amount: 15,
    });

    expect(transfer.isSuccess).toBeTruthy();

    const result = transfer.getValue();
    expect(result.receiver.amount).toBe(25);
    expect(result.sender.amount).toBe(35);
  });
});
