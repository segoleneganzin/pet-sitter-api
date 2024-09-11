import { decodedJwtToken } from './decodedJwtToken';
// import { dbInstance as db } from '../database/connection';
// import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { UserModel } from '../database/models/userModel';
import { I_SitterDocument, SitterModel } from '../database/models/sitterModel';
import { I_OwnerDocument, OwnerModel } from '../database/models/ownerModel';
interface DecodedJwt {
  id: string;
}

export const profileAccess = async (
  authHeader: string
): Promise<I_SitterDocument | I_OwnerDocument | null> => {
  try {
    const decodedJwt: DecodedJwt = await decodedJwtToken(authHeader);
    if (!mongoose.Types.ObjectId.isValid(decodedJwt.id)) {
      throw new Error('Invalid user ID');
    }
    const user = await UserModel.findById(decodedJwt.id);
    if (!user) {
      throw new Error('User not found');
    }
    let profile = null;
    if (user.role === 'sitter') {
      profile = await SitterModel.findById(user.profileId);
    }
    if (user.role === 'owner') {
      profile = await OwnerModel.findById(user.profileId);
    }

    return profile;

    // const sitters = db.collection('pet-sitters');
    // const users = db.collection('users');

    // const decodedJwt: DecodedJwt = await decodedJwtToken(authHeader);

    // if (!ObjectId.isValid(decodedJwt.id)) {
    //   throw new Error('Invalid user ID');
    // }

    // const userId = new ObjectId(decodedJwt.id);
    // const user = await users.findOne({ _id: userId });

    // if (!user) {
    //   throw new Error('User not found');
    // }

    // const sitter = await sitters.findOne({ email: user.email });

    // if (!sitter) {
    //   throw new Error('Profile not found');
    // }

    // return sitter;
  } catch (error) {
    throw new Error('Profile not found');
  }
};
