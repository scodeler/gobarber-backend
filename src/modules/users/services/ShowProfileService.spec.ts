/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show the user profile', async () => {
    const userData = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData);

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe(userData.name);
    expect(profile.email).toBe(userData.email);
  });

  it('should not be able to show a non existing user profile', async () => {
    await expect(
      showProfile.execute({
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
