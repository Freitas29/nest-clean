import { Module } from '@nestjs/common';
import { TransfersController } from './tranfers.controller';
import { SendTransferUseCase } from './send-transfer.use-case';
import { UserRepository } from 'src/users/user.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TransfersController],
  imports: [UsersModule],
  providers: [
    UserRepository,
    SendTransferUseCase,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    {
      provide: 'ISendTransferUseCase',
      useExisting: SendTransferUseCase,
    },
  ],
})
export class TranfersModule {}
