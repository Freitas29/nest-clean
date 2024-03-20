import { faker } from '@faker-js/faker';
import { User, UserData, UserType } from '../User';
import { Factory } from 'fishery';
import Result from '../../common/Result';

export const createFakeUser = Factory.define<UserData, any, Result<User>>(
  ({ params, onCreate }) => {
    onCreate((user) => User.create(user));

    return {
      document:
        params.document || faker.helpers.replaceSymbols('###.###.###-##'),
      email: params.email || faker.internet.email(),
      nome: params.nome || faker.internet.userName(),
      userType: params.userType || UserType.Comum,
    };
  },
);
