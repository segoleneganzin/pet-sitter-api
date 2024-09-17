import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/customError';
import { I_User, UserModel } from '../database/models/userModel';

export const login = async (
  serviceData: I_User
): Promise<{ token: string }> => {
  try {
    const user = await UserModel.findOne({ email: serviceData.email });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    const isValid = await bcrypt.compare(serviceData.password, user.password);
    if (!isValid) {
      throw new CustomError(401, 'Invalid username/password supplied');
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
