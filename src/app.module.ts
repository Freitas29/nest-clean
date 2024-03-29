import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TranfersModule } from './transfers/tranfers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TranfersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
