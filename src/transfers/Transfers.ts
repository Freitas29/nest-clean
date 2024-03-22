import Result from '../common/Result';
import { User, UserType } from '../users/User';

type TransferData = {
  receiver: User;
  sender: User;
  amount: number;
};

export class Transfers {
  receiver: User;
  sender: User;
  amount: number;

  private constructor(props: TransferData) {
    this.receiver = props.receiver;
    this.sender = props.sender;
    this.amount = props.amount;
  }

  static execute(props: TransferData): Result<Transfers> {
    if (props.sender.userType === UserType.Lojista) {
      return Result.fail('Lojistas não podem realizar transferência');
    }

    if (props.sender.amount < props.amount) {
      return Result.fail('Saldo insuficiente');
    }

    props.sender.amount -= props.amount;
    props.receiver.amount += props.amount;

    return Result.ok(new Transfers(props));
  }
}
