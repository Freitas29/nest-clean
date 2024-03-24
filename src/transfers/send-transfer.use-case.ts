import Result from '../common/Result';
import { ISendTransferUseCase, SendTranferInput } from './SendTransfer';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../users/UserRepository';
import { Transfers } from './Transfers';

@Injectable()
export class SendTransferUseCase implements ISendTransferUseCase {
  private DEFAULT_ERROR = 'Não foi possível realizar a transferência';

  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async sendTranfer(input: SendTranferInput): Promise<Result<Transfers>> {
    const [sender, receiver] = await Promise.all([
      this.userRepo.findById(input.sender),
      this.userRepo.findById(input.receiver),
    ]);

    if (sender.isFailure || receiver.isFailure)
      return Result.fail(this.DEFAULT_ERROR);

    const tranfer = Transfers.execute({
      amount: input.amount,
      receiver: receiver.getValue(),
      sender: sender.getValue(),
    });

    if (tranfer.isFailure) return Result.fail(tranfer.error);

    const [senderUpdated, userUpdated] = await Promise.all([
      this.userRepo.update(sender.getValue()),
      this.userRepo.update(receiver.getValue()),
    ]);

    if (senderUpdated.isFailure || userUpdated.isFailure)
      return Result.fail(this.DEFAULT_ERROR);

    return Result.ok(tranfer.getValue());
  }
}
