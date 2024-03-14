import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './User';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  providers: [
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
})
export class UsersModule {}
