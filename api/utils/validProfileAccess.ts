import { decodedJwtToken } from './decodedJwtToken';
import mongoose from 'mongoose';
import { UserModel } from '../database/models/userModel';

interface DecodedJwt {
  id: string;
}

export const validProfileAccess = async ({
  authHeader,
  profileId,
}: {
  authHeader: string;
  profileId: mongoose.Types.ObjectId;
}): Promise<void> => {
  try {
    const decodedJwt: DecodedJwt = await decodedJwtToken(authHeader);
    if (!mongoose.Types.ObjectId.isValid(decodedJwt.id)) {
      throw new Error('Invalid user ID');
    }
    const user = await UserModel.findById(decodedJwt.id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.profileId || !profileId.equals(user.profileId)) {
      throw new Error('Unauthorized access');
    }
  } catch (error) {
    throw error;
  }
};
