import { Column, Entity, PrimaryColumn } from 'typeorm';
import Email from './Email';
import Result from './Result';

export type UserData = {
  nome: string;
  cpf: string;
  email: Email;
};

@Entity()
export default class User {
  @PrimaryColumn()
  id: string; //uuid

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column()
  email: Email;

  private constructor(props: UserData, id?: string) {
    this.id = id ?? Math.random().toString();
    Object.apply(this, props);
  }

  static create(
    props: {
      email: string;
      cpf: string;
      nome: string;
    },
    id?: string,
  ): Result<User> {
    const email = Email.create(props.email);

    if (email.isFailure) return Result.fail(email.error);

    return Result.ok(
      new User(
        { email: email.getValue(), cpf: props.cpf, nome: props.nome },
        id,
      ),
    );
  }
}
