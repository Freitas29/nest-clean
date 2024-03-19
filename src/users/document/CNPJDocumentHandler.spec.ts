import { CNPJValidator } from '../../common/validators/CNPJ-validator';
import { CNPJDocumentHandler } from './CNPJDocumentHandler';
import { IValidator } from '../../common/validators/Validator';
import { UserType } from '../User';

describe('CNPJDocumentHandler', () => {
  const CNPJ_VALIDO_MASCARA = '20.574.748/0001-05';
  const CNPJ_VALIDO_SEM_MASCARA = '55454336000116';

  const factory = () => {
    const validator: IValidator = new CNPJValidator();
    const CNPJHandler = new CNPJDocumentHandler(validator);

    return CNPJHandler;
  };

  it('Deve retornar TRUE para um CNPJ válido com mascara para usuário comum', () => {
    const result = factory().handler(UserType.Lojista, CNPJ_VALIDO_MASCARA);

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toBeTruthy();
  });

  it('Deve retornar TRUE para um CNPJ válido SEM mascara para usuário comum', () => {
    const result = factory().handler(UserType.Lojista, CNPJ_VALIDO_SEM_MASCARA);

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toBeTruthy();
  });

  it('Deve retornar uma falha e ERRO para um CNPJ válido com mascara para usuário lojista', () => {
    const result = factory().handler(UserType.Comum, CNPJ_VALIDO_SEM_MASCARA);

    expect(result.isFailure).toBeTruthy();
    expect(result.error).toBe('Não foi possível identificar o documento');
  });

  it('Deve retornar false, sem erro,  para um CNPJ inválido com mascara para usuário comum', () => {
    const result = factory().handler(UserType.Lojista, '483924');

    expect(result.isFailure).toBeFalsy();
    expect(result.getValue()).toBeFalsy();
  });
});
