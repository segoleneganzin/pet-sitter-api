import { decodedJwtToken } from './decodedJwtToken';
import { dbInstance as db } from '../database/connection';
import { ObjectId } from 'mongodb';

interface DecodedJwt {
  id: string;
}

export const profileAccess = async (authHeader: string): Promise<any> => {
  try {
    const petSitters = db.collection('pet-sitters');
    const users = db.collection('users');

    const decodedJwt: DecodedJwt = await decodedJwtToken(authHeader);

    if (!ObjectId.isValid(decodedJwt.id)) {
      throw new Error('Invalid user ID');
    }

    const userId = new ObjectId(decodedJwt.id);
    const user = await users.findOne({ _id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const petSitter = await petSitters.findOne({ email: user.email });

    if (!petSitter) {
      throw new Error('Profile not found');
    }

    return petSitter;
  } catch (error) {
    throw new Error('Profile not found');
  }
};
