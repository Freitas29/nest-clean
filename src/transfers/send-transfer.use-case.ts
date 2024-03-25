import Result from '../common/Result';
import { ISendTransferUseCase, SendTranferInput } from './SendTransfer';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../users/UserRepository';
import { Transfers } from './Transfers';
import { DataSource, QueryRunner } from 'typeorm';
import { IAuthorizationTranferGateway } from './AuthorizationGateway';

export class SendTransferUseCase implements ISendTransferUseCase {
  private DEFAULT_ERROR = 'Não foi possível realizar a transferência';

  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    private readonly dataSource: DataSource,
    @Inject('IAuthorizationTranferGateway')
    private readonly authorizationGateway: IAuthorizationTranferGateway,
  ) {}

  private handleError(query: QueryRunner, error?: string): Result<Transfers> {
    query.rollbackTransaction();

    return Result.fail(error || this.DEFAULT_ERROR);
  }

  async sendTranfer(input: SendTranferInput): Promise<Result<Transfers>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    const [sender, receiver] = await Promise.all([
      this.userRepo.findById(input.sender),
      this.userRepo.findById(input.receiver),
    ]);

    if (sender.isFailure || receiver.isFailure)
      return this.handleError(queryRunner);

    const tranfer = Transfers.execute({
      amount: input.amount,
      receiver: receiver.getValue(),
      sender: sender.getValue(),
    });

    if (tranfer.isFailure) return this.handleError(queryRunner, tranfer.error);

    const [senderUpdated, userUpdated] = await Promise.all([
      this.userRepo.update(sender.getValue()),
      this.userRepo.update(receiver.getValue()),
    ]);

    if (senderUpdated.isFailure || userUpdated.isFailure)
      return this.handleError(queryRunner);

    const isAuthorized = await this.authorizationGateway.authorize();

    if (!isAuthorized)
      return this.handleError(queryRunner, 'Transferência não autorizada');

    await queryRunner.commitTransaction();
    await queryRunner.release();
    return Result.ok(tranfer.getValue());
  }
}
