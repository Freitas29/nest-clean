import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './User';
import { UserRepository } from './user.repository';
import { CreateUserUseCase } from './create-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  providers: [
    CreateUserUseCase,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
})
export class UsersModule {}
