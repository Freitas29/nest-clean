import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Email from './Email';
import Result from '../common/Result';
import { CNPJDocumentHandler } from './document/CNPJDocumentHandler';
import { CPFDocumentHandler } from './document/CPFDocumentHandler';
import { CNPJValidator } from '../common/validators/cnpj-validator';
import { CPFValidator } from '../common/validators/cpf-validator';
export type UserData = {
  nome: string;
  document: string;
  email: string;
  userType: UserType;
};

export enum UserType {
  Comum = 'comum',
  Lojista = 'lojista',
}

const CNPJ_VALIDATOR = new CNPJValidator();

const CPF_VALIDATOR = new CPFValidator();

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; //uuid

  @Column({ type: 'text', nullable: false })
  nome: string;

  @Column({ unique: true, type: 'text', nullable: false })
  document: string;

  @Column({ unique: true, type: 'text', nullable: false })
  email: string;

  @Column({ enum: UserType })
  userType: UserType;

  constructor(props: UserData, id?: string) {
    Object.assign(this, props);
    this.id = id ?? Math.random().toString();
  }

  static create(props: UserData, id?: string): Result<User> {
    const email = Email.create(props.email);

    if (email.isFailure) return Result.fail(email.error);

    return Result.ok(
      new User(
        {
          email: email.getValue().props.email,
          document: props.document,
          nome: props.nome,
          userType: props.userType,
        },
        id,
      ),
    );
  }

  isValidDocument(): Result<boolean> {
    const cnpjHandler = new CNPJDocumentHandler(CNPJ_VALIDATOR);
    const cpfHandler = new CPFDocumentHandler(CPF_VALIDATOR);
    cnpjHandler.setNext(cpfHandler);

    const result = cnpjHandler.handler(this.userType, this.document);

    if (result.isFailure) return Result.fail(result.error);

    return Result.ok(result.getValue());
  }
}
