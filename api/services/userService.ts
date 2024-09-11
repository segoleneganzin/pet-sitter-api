import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
// import { ObjectId, ReturnDocument } from 'mongodb';
// import { dbInstance as db } from '../database/connection';
import { decodedJwtToken } from '../utils/decodedJwtToken';
import * as sitterService from './sitterService';
import * as ownerService from './ownerService';
import { IncomingHttpHeaders } from 'http';
import {
  I_UserDocument,
  I_User,
  I_UserCreate,
  I_UserUpdate,
  UserModel,
} from '../database/models/userModel';

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}

export const loginUser = async (
  serviceData: I_User
): Promise<{ token: string }> => {
  try {
    const user = await UserModel.findOne({ email: serviceData.email });
    if (!user) {
      throw new Error('User not found!');
    }

    const isValid = await bcrypt.compare(serviceData.password, user.password);
    if (!isValid) {
      throw new Error('Invalid combination');
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.SECRET_KEY || 'default-secret-key',
      { expiresIn: '1d' }
    );
    return { token };
  } catch (error) {
    console.error('Error in loginService', error);
    throw error;
  }
};

// Service to create a new user
export const createUser = async (
  serviceData: I_UserCreate
): Promise<I_UserDocument> => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      city,
      country,
      tel = '',
      acceptedPets = [],
      presentation = '',
      pets = [],
    } = serviceData;
    // Check if email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    if (!password) {
      throw new Error('Password is required');
    }
    let newProfile = null;
    if (role === 'sitter') {
      newProfile = await sitterService.createSitter({
        firstName,
        lastName,
        tel,
        city,
        country,
        acceptedPets,
        presentation,
      });
    }
    if (role === 'owner') {
      newProfile = await ownerService.createOwner({
        firstName,
        lastName,
        city,
        country,
        pets,
      });
    }

    if (!newProfile) {
      throw new Error('Profile creation failed');
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 12);

    // Create and save the new User
    const newUser = new UserModel({
      email,
      password: hashPassword,
      role,
      profileId: newProfile._id,
    });

    await newUser.save();
    return newUser;
  } catch (error: any) {
    console.error('Error in createUser:', error.message);
    throw new Error(error.message);
  }
};

// Service to get user details
export const getUser = async (headers: Headers): Promise<I_UserDocument> => {
  try {
    if (!headers.authorization) {
      throw new Error('Authorization header is missing');
    }

    const decodedJwt = await decodedJwtToken(headers.authorization);

    const user = await UserModel.findById(decodedJwt.id);
    if (!user) {
      throw new Error('User not found!');
    }

    return user;
  } catch (error: any) {
    console.error('Error in getUser:', error);
    throw new Error(error);
  }
};

export const getUserEmail = async (
  req: Request,
  res: Response
): Promise<string> => {
  try {
    // const users = db.collection('users');
    const { id } = req.params; // sitterId or ownerId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const user = await UserModel.findOne({ profileId: id });

    if (!user) {
      throw new Error('Email not found');
    }
    return user.email;
  } catch (error: any) {
    console.error('Error in getEmail:', error.message);
    throw new Error(error.message);
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
      throw new Error('Authorization header is missing');
    }

    const decodedJwt = await decodedJwtToken(headers.authorization);
    const updateData: Partial<I_UserUpdate> = {};

    // Update email if provided
    if (body.email) {
      const existingEmail = await UserModel.findOne({ email: body.email });
      if (existingEmail) {
        throw new Error('Email already exists');
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
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error: any) {
    console.error('Error in updateUser:', error.message);
    throw new Error(error.message);
  }
};

// Service to delete user
export const deleteUser = async (headers: Headers): Promise<void> => {
  try {
    if (!headers.authorization) {
      throw new Error('Authorization header is missing');
    }
    const decodedJwt = await decodedJwtToken(headers.authorization);
    const user = await UserModel.findById(decodedJwt.id);

    if (!user) {
      throw new Error('User not found');
    }
    if (user.role === 'sitter') {
      await sitterService.deleteSitter(user.profileId);
    }
    if (user.role === 'owner') {
      await ownerService.deleteOwner(user.profileId);
    }
    await UserModel.findByIdAndDelete(user._id);
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    throw new Error(error.message);
  }
};
