import { Module } from '@nestjs/common';
import { TransfersController } from './tranfers.controller';
import { SendTransferUseCase } from './send-transfer.use-case';
import { UserRepository } from 'src/users/user.repository';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationGatewayAdapter } from './AuthorizationGatewayAdapter';
import { AxiosHttpAdapter } from 'src/common/adapters/AxiosHttpAdapter';

@Module({
  controllers: [TransfersController],
  imports: [UsersModule, TypeOrmModule],
  providers: [
    UserRepository,
    SendTransferUseCase,
    AuthorizationGatewayAdapter,
    AxiosHttpAdapter,
    // TypeOrmModule,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    {
      provide: 'ISendTransferUseCase',
      useExisting: SendTransferUseCase,
    },
    // {
    //   provide: 'DataSource',
    //   useExisting: TypeOrmModule.forRoot(),
    // },
    {
      provide: 'IAuthorizationTranferGateway',
      useExisting: AuthorizationGatewayAdapter,
    },
    {
      provide: 'httpClient',
      useExisting: AxiosHttpAdapter,
    },
  ],
})
export class TranfersModule {}
