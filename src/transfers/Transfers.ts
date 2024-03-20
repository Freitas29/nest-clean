import { User, UserType } from '../users/User';

type TransferData = {
  receiver: User;
  sender: User;
};

export class Transfers {
  receiver: User;
  sender: User;

  constructor(props: TransferData) {
    if (props.sender.userType === UserType.Lojista)
      throw new Error('Lojistas não podem realizar transferência');

    this.receiver = props.receiver;
    this.sender = props.sender;
  }
}
