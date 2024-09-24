import bcrypt from 'bcrypt';
import { Request } from 'express';
import mongoose from 'mongoose';
import * as sitterService from './sitterService';
import * as ownerService from './ownerService';
import { IncomingHttpHeaders } from 'http';
import { CustomError } from '../utils/customError';
import {
  I_UserDocument,
  I_User,
  I_UserUpdate,
  UserModel,
} from '../database/models/userModel';
import { SitterModel } from '../database/models/sitterModel';
import { OwnerModel } from '../database/models/ownerModel';

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}
interface ExtendsRequest extends Request {
  token?: { id: string };
}

// Service to create a new user with formData
export const createUser = async (req: Request): Promise<I_UserDocument> => {
  try {
    const { body, file } = req;

    if (file) {
      body.profilePicture = `/${file.filename}`;
    } else {
      body.profilePicture = '/default-profile-picture.png';
    }

    // Check if email already exists
    const existingEmail = await UserModel.findOne({ email: body.email });
    if (existingEmail) {
      throw new CustomError(409, 'Email already exists');
    }
    if (!body.password) {
      throw new CustomError(400, 'Password is required');
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(body.password, 12);

    if (typeof body.roles === 'string') {
      body.roles = body.roles.split(',').map((role: string) => role.trim());
    }
    // Create and save the new User
    const newUser = new UserModel({
      email: body.email,
      password: hashPassword,
      roles: body.roles,
    });

    await newUser.save();

    body.userId = newUser.id;

    if (body.roles.includes('sitter')) {
      await sitterService.createSitter(body);
    }
    if (body.roles.includes('owner')) {
      await ownerService.createOwner(body);
    }

    return newUser;
  } catch (error: any) {
    console.error('Error in createUser:', error.message);
    throw error;
  }
};

export const getUserById = async (req: Request): Promise<I_UserDocument> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    return user;
  } catch (error: any) {
    console.error('Error in getUser:', error);
    throw error;
  }
};

// Service to update user details
export const updateUser = async (
  req: ExtendsRequest
): Promise<I_UserDocument> => {
  try {
    const { body, token } = req;
    const updateData: Partial<I_UserUpdate> = {};
    if (body.email) {
      const existingEmail = await UserModel.findOne({ email: body.email });
      if (existingEmail) {
        throw new CustomError(409, 'Email already exists');
      }
      updateData.email = body.email;
    }

    if (body.password) {
      const hashPassword = await bcrypt.hash(body.password, 12);
      updateData.password = hashPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      token?.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      throw new CustomError(404, 'User not found');
    }

    return updatedUser;
  } catch (error: any) {
    console.error('Error in updateUser:', error.message);
    throw error;
  }
};

// Service to delete user
export const deleteUser = async (req: ExtendsRequest): Promise<void> => {
  try {
    const { body, token } = req;

    const user = await UserModel.findById(token?.id);

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if (body.email !== user.email || !isValid) {
      throw new CustomError(400, 'Invalid email/password supplied');
    }
    if (user.roles.includes('sitter')) {
      const sitter = await SitterModel.findOne({ userId: user.id });
      await sitterService.deleteSitter(sitter?.id);
    }
    if (user.roles.includes('owner')) {
      const owner = await OwnerModel.findOne({ userId: user.id });
      await ownerService.deleteOwner(owner?.id);
    }

    await UserModel.findByIdAndDelete(user.id);
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    throw error;
  }
};
