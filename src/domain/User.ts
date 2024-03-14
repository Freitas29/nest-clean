import Entity from './Entity';
import Email from './Email';
import Result from './Result';

type UserData = {
  nome: string;
  cpf: string;
  email: Email;
};

export default class User extends Entity<UserData> {
  private constructor(props: UserData) {
    super(props);
  }

  static create(props: { email: string; cpf: string; nome: string }) {
    const email = Email.create(props.email);

    if (email.isFailure) return Result.fail(email.error);

    return Result.ok(
      new User({ email: email.getValue(), cpf: props.cpf, nome: props.nome }),
    );
  }
}
