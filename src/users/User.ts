import { Column, Entity, ObjectIdColumn } from 'typeorm';
import Email from './Email';
import Result from './Result';

export type UserData = {
  nome: string;
  cpf: string;
  email: string;
};

@Entity()
export class User {
  @ObjectIdColumn()
  id: string; //uuid

  @Column({ type: 'text', nullable: false })
  nome: string;

  @Column({ unique: true, type: 'text', nullable: false })
  cpf: string;

  @Column({ unique: true, type: 'text', nullable: false })
  email: string;

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
          cpf: props.cpf,
          nome: props.nome,
        },
        id,
      ),
    );
  }
}
