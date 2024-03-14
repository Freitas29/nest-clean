import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([]),
];
