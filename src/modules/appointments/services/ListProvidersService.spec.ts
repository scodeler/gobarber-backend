/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
// import { uuid } from 'uuidv4';

// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

type FakeUSer = {
  name: string;
  email: string;
  password: string;
};

const createUser = (): FakeUSer => {
  const user = {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return user;
};

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create(createUser());
    const user2 = await fakeUsersRepository.create(createUser());
    const loggedUser = await fakeUsersRepository.create(createUser());

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
