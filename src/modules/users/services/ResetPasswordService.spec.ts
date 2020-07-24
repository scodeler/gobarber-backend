// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });
  it('should be able to reset the password', async () => {
    const userData = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData);

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const newPassword = faker.internet.password();
    await resetPassword.execute({
      password: newPassword,
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(updatedUser?.password).toBe(newPassword);
  });

  it('should not be able to reset password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'not-a-valid-token',
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'not-a-valid-user',
    );

    await expect(
      resetPassword.execute({
        token,
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if token is older than 2 hours', async () => {
    const userData = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await fakeUsersRepository.create(userData);
    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: faker.internet.password(),
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
