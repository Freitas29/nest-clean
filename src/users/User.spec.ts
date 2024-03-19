// import Email from './Email';
import { faker } from '@faker-js/faker';
import { User, UserType } from './User';
import { createFakeUser } from './mocks/UserMock';

describe('User', () => {
  const CNPJ_VALIDO = '55454336000116';
  const CPF_VALIDO = '616.772.970-00';

  it('Deve criar um usuário com sucesso', () => {
    const user = createFakeUser();

    expect(user.isSuccess).toBeTruthy();
  });

  it('Não deve criar um usuário com erro no email', () => {
    const user = User.create({
      document: faker.helpers.replaceSymbols('###.###.###-##'),
      email: 'jfkdls',
      nome: faker.internet.userName(),
      userType: UserType.Comum,
    });

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

  it('Deve retornar true para o lojista com CNPJ válido', () => {
    const user = User.create({
      document: CNPJ_VALIDO,
      email: 'teste@email.com',
      nome: '122',
      userType: UserType.Lojista,
    }).getValue();

    expect(user.isValidDocument()).toBeTruthy();
  });

  it('Deve retornar true para o comum com CPF válido', () => {
    const user = User.create({
      document: CPF_VALIDO,
      email: 'teste@email.com',
      nome: '122',
      userType: UserType.Comum,
    }).getValue();

    expect(user.isValidDocument()).toBeTruthy();
  });

  it('Deve retornar false para o comum com CNPJ válido', () => {
    const user = User.create({
      document: CNPJ_VALIDO,
      email: 'teste@email.com',
      nome: '122',
      userType: UserType.Comum,
    }).getValue();

    expect(user.isValidDocument()).toBeFalsy();
  });

  it('Deve retornar false para o Lojista com CPF válido', () => {
    const user = User.create({
      document: CPF_VALIDO,
      email: 'teste@email.com',
      nome: '122',
      userType: UserType.Lojista,
    }).getValue();

    expect(user.isValidDocument()).toBeFalsy();
  });
});
