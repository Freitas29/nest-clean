import { faker } from '@faker-js/faker';
import { User, UserType } from '../User';

export const createFakeUser = () =>
  User.create({
    document: faker.helpers.replaceSymbols('###.###.###-##'),
    email: faker.internet.email(),
    nome: faker.internet.userName(),
    userType: UserType.Comum,
  });
