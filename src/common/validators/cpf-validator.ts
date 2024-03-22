import { IValidator } from './Validator';

export class CPFValidator implements IValidator {
  isValid(value: string | null): boolean {
    let cpf = value || '';
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) {
      return false; // CPF deve ter 11 dígitos
    }

    if (/(.)\1{10}/.test(cpf)) {
      return false; // CPF não pode ter todos os dígitos iguais
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(9))) {
      return false; // Primeiro dígito verificador inválido
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(10))) {
      return false; // Segundo dígito verificador inválido
    }

    return true;
  }
}
