import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    // Loads users repository and fetch the user that has that ID
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);

    // Verifies if user is authenticated
    if (!user) {
      throw new Error('Only authenticated users can change avatars.');
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
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
