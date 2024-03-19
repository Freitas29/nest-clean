// import Email from './Email';
import { User, UserType } from './User';
import { createFakeUser } from './mocks/UserMock';

describe('User', () => {
  it('Deve criar um usuário com sucesso', () => {
    const user = createFakeUser();

    expect(user.isSuccess).toBeTruthy();
  });

  it('Não deve criar um usuário com erro no email', () => {
    const user = createFakeUser();

    expect(user.isSuccess).toBeFalsy();
    expect(user.error).toBe('E-mail inválido');
  });

  it('Deve criar um usuário do tipo comum', () => {
    const user = User.create({
      document: '21323',
      email: 'teste@email.com',
      nome: '122',
      userType: UserType.Comum,
    });

    expect(user.getValue().userType).toBe(UserType.Comum);
  });

  it('Deve criar um usuário do tipo lojista', () => {
    const user = User.create({
      document: '21323',
      email: 'teste@email.com',
      nome: '122',
      userType: UserType.Lojista,
    });

    expect(user.getValue().userType).toBe(UserType.Lojista);
  });
});
