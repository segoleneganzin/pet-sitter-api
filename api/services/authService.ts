import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/customError.js';
import {
  I_Auth,
  I_UserDocument,
  UserModel,
} from '../database/models/userModel.js';

interface ExtendsRequest extends Request {
  token?: { id: string };
}

export const login = async (
  serviceData: I_Auth
): Promise<{ token: string }> => {
  try {
    const user = await UserModel.findOne({ email: serviceData.email });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    const isValid = await bcrypt.compare(serviceData.password, user.password);
    if (!isValid) {
      throw new CustomError(401, 'Invalid email/password supplied');
    }
    const token = jwt.sign(
      { id: user.id.toString() },
      process.env.SECRET_KEY || 'default-secret-key',
      { expiresIn: '1d' }
    );
    return { token };
  } catch (error) {
    console.error('Error in loginService', error);
    throw error;
  }
};

export const updateLog = async (
  req: ExtendsRequest
): Promise<I_UserDocument> => {
  try {
    const { body, token } = req;
    const user = await UserModel.findById(token?.id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    if (body) {
      if (body.email) {
        const existingEmail = await UserModel.findOne({ email: body.email });
        if (existingEmail && existingEmail.id !== user.id) {
          throw new CustomError(409, 'Email already exists');
        }
        user.email = body.email;
      }
      if (body.password) {
        user.password = await bcrypt.hash(body.password, 12);
      }
    }
    const updatedUser = await user.save();
    if (!updatedUser) {
      throw new CustomError(500, 'Failed to update user');
    }
    return updatedUser;
  } catch (error: any) {
    console.error('Error in updateUser:', error.message);
    throw error;
  }
};
