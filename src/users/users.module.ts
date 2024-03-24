import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './User';
import { UserRepository } from './user.repository';
import { CreateUserUseCase } from './create-user.use-case';
import { UsersControler } from './users.controler';
import { FindUserUseCase } from './find-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  controllers: [UsersControler],
  providers: [
    CreateUserUseCase,
    FindUserUseCase,
    UserRepository,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
})
export class UsersModule {}
