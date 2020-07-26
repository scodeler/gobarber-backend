/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const userData = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData);

    const newUserData = {
      user_id: user.id,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
    };

    const updatedUser = await updateProfile.execute(newUserData);

    expect(updatedUser.name).toBe(newUserData.name);
    expect(updatedUser.email).toBe(newUserData.email);
  });

  it('should not be able to change email into a already used one', async () => {
    const userData = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await fakeUsersRepository.create(userData);

    const userData2 = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData2);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: userData.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const userData = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData);

    const updatedData = {
      user_id: user.id,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      old_password: user.password,
      password: faker.internet.password(),
    };

    const updatedUser = await updateProfile.execute(updatedData);

    await expect(updatedUser.password).toBe(updatedData.password);
  });

  it('should not be able to update the password without old password', async () => {
    const userData = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong password', async () => {
    const userData = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        old_password: faker.internet.password(),
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
