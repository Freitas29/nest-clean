import { CPFValidator } from '../../common/validators/cpf-validator';
import { CPFDocumentHandler } from './CPFDocumentHandler';
import { IValidator } from '../../common/validators/Validator';
import { UserType } from '../User';

describe('CPFDocumentHandler', () => {
  const CPF_VALIDO_MASCARA = '594.365.400-35';
  const CPF_VALIDO_SEM_MASCARA = '41702599043';

  const factory = () => {
    const validator: IValidator = new CPFValidator();
    const cpfHandler = new CPFDocumentHandler(validator);

    return cpfHandler;
  };

  it('Deve retornar TRUE para um cpf válido com mascara para usuário comum', () => {
    const result = factory().handler(UserType.Comum, CPF_VALIDO_MASCARA);

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toBeTruthy();
  });

  it('Deve retornar TRUE para um cpf válido SEM mascara para usuário comum', () => {
    const result = factory().handler(UserType.Comum, CPF_VALIDO_SEM_MASCARA);

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toBeTruthy();
  });

  it('Deve retornar uma falha e ERRO para um cpf válido com mascara para usuário lojista', () => {
    const result = factory().handler(UserType.Lojista, CPF_VALIDO_SEM_MASCARA);

    expect(result.isFailure).toBeTruthy();
    expect(result.error).toBe('Não foi possível identificar o documento');
  });

  it('Deve retornar false, sem erro,  para um cpf inválido com mascara para usuário comum', () => {
    const result = factory().handler(UserType.Comum, '483924');

    expect(result.isFailure).toBeFalsy();
    expect(result.getValue()).toBeFalsy();
  });
});
