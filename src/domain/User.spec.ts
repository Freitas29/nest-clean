// import Email from './Email';
import User from './User';

describe('User', () => {
  it('Deve criar um usuário com sucesso', () => {
    const user = User.create({
      cpf: '2323',
      email: 'teste@email.com',
      nome: '1212',
    });

    expect(user.isSuccess).toBeTruthy();
  });

  it('Deve criar um usuário com erro no email', () => {
    const user = User.create({
      cpf: '2323',
      email: 'temail.com',
      nome: '1212',
    });

    expect(user.isSuccess).toBeFalsy();
    expect(user.error).toBe('Erro ao cri email');
  });

  // it("Deve gerar um erro quando o email do usuário é inválido", () => {

  // })
});
