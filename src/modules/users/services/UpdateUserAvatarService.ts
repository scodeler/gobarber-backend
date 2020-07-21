import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    // Loads users repository and fetch the user that has that ID
    const user = await this.usersRepository.findById(user_id);

    // Verifies if user is authenticated
    if (!user) {
      throw new AppError('Only authenticated users can change avatars.', 401);
    }

    // Verifies if user already has an avatar to delete it or insert new one
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      // Verifies if file exists. If it does, delete it
      const userAvatarExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Update the avatar URL in the database
    user.avatar = avatarFilename;
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
