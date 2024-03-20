import Result from '../common/Result';
import { User, UserType } from '../users/User';

type TransferData = {
  receiver: User;
  sender: User;
};

export class Transfers {
  receiver: User;
  sender: User;

  constructor(props: TransferData) {
    this.receiver = props.receiver;
    this.sender = props.sender;
  }

  static execute(props: TransferData): Result<Transfers> {
    if (props.sender.userType === UserType.Lojista) {
      return Result.fail('Lojistas não podem realizar transferência');
    }

    return Result.ok(new Transfers(props));
  }
}
