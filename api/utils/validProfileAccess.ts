import mongoose from 'mongoose';
import { UserModel } from '../database/models/userModel.js';
import { CustomError } from './customError.js';

export const validProfileAccess = async ({
  tokenId,
  userId,
}: {
  tokenId: string | undefined;
  userId: mongoose.Types.ObjectId;
}): Promise<void> => {
  try {
    const user = await UserModel.findById(tokenId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    if (!userId.equals(user.id)) {
      throw new CustomError(401, 'Unauthorized access');
    }
  } catch (error) {
    throw error;
  }
};
