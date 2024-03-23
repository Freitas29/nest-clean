import Result from '../common/Result';
import { ISendTransferUseCase, SendTranferInput } from './SendTransfer';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../users/UserRepository';
import { Transfers } from './Transfers';

export class SendTransferUseCase implements ISendTransferUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async sendTranfer(input: SendTranferInput): Promise<Result<Transfers>> {
    const [sender, receiver] = await Promise.all([
      this.userRepo.findById(input.sender),
      this.userRepo.findById(input.receiver),
    ]);

    if (sender.isFailure || receiver.isFailure)
      return Result.fail('Não foi possível realizar a transferência');

    const tranfer = Transfers.execute({
      amount: input.amount,
      receiver: receiver.getValue(),
      sender: sender.getValue(),
    });

    if (tranfer.isFailure) return Result.fail(tranfer.error);

    return Result.ok(tranfer.getValue());
  }
}
