import bcrypt from 'bcrypt';
import { Request } from 'express';
import mongoose from 'mongoose';
import { decodedJwtToken } from '../utils/decodedJwtToken';
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

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
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
    let newProfile = null;
    if (body.role === 'sitter') {
      newProfile = await sitterService.createSitter(body);
    }
    if (body.role === 'owner') {
      newProfile = await ownerService.createOwner(body);
    }
    if (!newProfile) {
      throw new CustomError(500, 'Profile creation failed');
    }
    // Hash the password
    const hashPassword = await bcrypt.hash(body.password, 12);

    // Create and save the new User
    const newUser = new UserModel({
      email: body.email,
      password: hashPassword,
      role: body.role,
      profileId: newProfile.id,
    });

    await newUser.save();
    return newUser;
  } catch (error: any) {
    console.error('Error in createUser:', error.message);
    throw error;
  }
};

// Service to get user details
export const getUser = async (headers: Headers): Promise<I_UserDocument> => {
  try {
    if (!headers.authorization) {
      throw new CustomError(401, 'Authorization header is missing');
    }

    const decodedJwt = await decodedJwtToken(headers.authorization);

    const user = await UserModel.findById(decodedJwt.id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    return user;
  } catch (error: any) {
    console.error('Error in getUser:', error);
    throw error;
  }
};

export const getUserEmail = async (req: Request): Promise<string> => {
  try {
    const { profileId } = req.params; // sitterId or ownerId
    if (!profileId || !mongoose.Types.ObjectId.isValid(profileId)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    const user = await UserModel.findOne({ profileId: profileId });

    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    return user.email;
  } catch (error: any) {
    console.error('Error in getEmail:', error.message);
    throw error;
  }
};

// Service to update user details
export const updateUser = async ({
  headers,
  body,
}: {
  headers: Headers;
  body: I_UserUpdate;
}): Promise<I_UserDocument> => {
  try {
    if (!headers.authorization) {
      throw new CustomError(401, 'Authorization header is missing');
    }

    const decodedJwt = await decodedJwtToken(headers.authorization);
    const updateData: Partial<I_UserUpdate> = {};

    // Update email if provided
    if (body.email) {
      const existingEmail = await UserModel.findOne({ email: body.email });
      if (existingEmail) {
        throw new CustomError(409, 'Email already exists');
      }
      updateData.email = body.email;
    }

    // Update password if provided
    if (body.password) {
      const hashPassword = await bcrypt.hash(body.password, 12);
      updateData.password = hashPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      decodedJwt.id,
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
export const deleteUser = async ({
  headers,
  body,
}: {
  headers: Headers;
  body: I_User;
}): Promise<void> => {
  try {
    if (!headers.authorization) {
      throw new CustomError(401, 'Authorization header is missing');
    }
    const decodedJwt = await decodedJwtToken(headers.authorization);
    const user = await UserModel.findById(decodedJwt.id);

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    if (body.email !== user.email) {
      throw new CustomError(400, 'Email is invalid');
    }
    const isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
      throw new CustomError(400, 'Password is invalid');
    }

    if (user.role === 'sitter') {
      await sitterService.deleteSitter(user.profileId);
    }
    if (user.role === 'owner') {
      await ownerService.deleteOwner(user.profileId);
    }
    await UserModel.findByIdAndDelete(user.id);
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    throw error;
  }
};
