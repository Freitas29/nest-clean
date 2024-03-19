import { IValidator } from './Validator';

export class CNPJValidator implements IValidator {
  isValid(value: string): boolean {
    let cnpj = value;

    cnpj = cnpj.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (cnpj.length !== 14) {
      return false; // CNPJ deve ter 14 dígitos
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
      return false; // CNPJ não pode ter todos os dígitos iguais
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
      return false; // Primeiro dígito verificador inválido
    }

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) {
      return false; // Segundo dígito verificador inválido
    }

    return true;
  }
}
