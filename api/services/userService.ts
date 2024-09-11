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
    // const users = db.collection('users');
    // const user = (await users.findOne({
    //   email: serviceData.email,
    // })) as I_UserDocument | null;
    // if (!user) {
    //   throw new Error('User not found!');
    // }

    // const isValid = await bcrypt.compare(serviceData.password, user.password);
    // if (!user || !isValid) {
    //   throw new Error('Invalid combination');
    // }

    // const token = jwt.sign(
    //   { id: (user._id as ObjectId).toString() },
    //   process.env.SECRET_KEY || 'default-secret-key',
    //   { expiresIn: '1d' }
    // );

    // return { token };
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
      profileId: newProfile._id,
    });

    await newUser.save();
    return newUser;
    // const users = db.collection('users');
    // const sitters = db.collection('pet-sitters');

    // const { email, password, firstName, lastName, city } = serviceData;

    // // Check if email already exists
    // const existingEmail = await users.findOne({ email });
    // if (existingEmail) {
    //   throw new Error('Email already exists');
    // }
    // if (!password) {
    //   throw new Error('Password is required');
    // }
    // // Create a new profile associated with the user
    // const newSitter = await sitters.insertOne({
    //   firstName,
    //   lastName,
    //   city,
    // });

    // const newSitterId = newSitter.insertedId;

    // // Hash the password
    // const hashPassword = await bcrypt.hash(password, 12);

    // // Create a new User document
    // const newUser = {
    //   email,
    //   password: hashPassword,
    //   sitterId: newSitterId,
    // };

    // // Save the new user into the database
    // await users.insertOne(newUser);
    // return newUser;
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
    // Check if authorization header is present
    // if (!headers || !headers.authorization) {
    //   throw new Error('Authorization header is missing');
    // }

    // const users = db.collection('users');
    // // Decode the JWT token to get the user ID
    // const decodedJwt = await decodedJwtToken(headers.authorization);
    // if (!ObjectId.isValid(decodedJwt.id)) {
    //   throw new Error('Invalid user ID');
    // }

    // const userId = new ObjectId(decodedJwt.id);
    // const user = (await users.findOne({
    //   _id: userId,
    // })) as I_UserDocument | null;

    // if (!user) {
    //   console.error('User not found with id:', userId);
    //   throw new Error('User not found!');
    // }

    // return user;
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
    // const users = db.collection('users');
    // const { id } = req.params;
    // if (!id || !ObjectId.isValid(id)) {
    //   res.status(400).send('Invalid ID format');
    //   return;
    // }
    // const sitterIdFormatted = new ObjectId(id);
    // const user = await users.findOne({ sitterId: sitterIdFormatted });
    // if (!user) {
    //   throw new Error('Email not found');
    // }
    // return user.email;
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

    // Check if authorization header is present
    // if (!headers || !headers.authorization) {
    //   throw new Error('Authorization header is missing');
    // }

    // const users = db.collection('users');

    // // Decode the JWT token to get the user ID
    // const decodedJwt = await decodedJwtToken(headers.authorization);
    // if (!ObjectId.isValid(decodedJwt.id)) {
    //   throw new Error('Invalid user ID');
    // }

    // const userId = new ObjectId(decodedJwt.id);
    // const updateData: Partial<I_Update> = {};

    // // Update email if provided
    // if (body.email) {
    //   const existingEmail = await users.findOne({ email: body.email });
    //   if (existingEmail) {
    //     throw new Error('Email already exists');
    //   }
    //   updateData.email = body.email;
    // }

    // // Update password if provided
    // if (body.password) {
    //   const hashPassword = await bcrypt.hash(body.password, 12);
    //   updateData.password = hashPassword;
    // }

    // const options = { returnDocument: ReturnDocument.AFTER };
    // const updatedUser = await users.findOneAndUpdate(
    //   { _id: userId },
    //   { $set: updateData },
    //   options
    // );

    // if (!updatedUser) {
    //   throw new Error('User not found');
    // }

    // return updatedUser.value as I_UserDocument;
  } catch (error: any) {
    console.error('Error in updateUser:', error.message);
    throw new Error(error.message);
  }
};

// Service to delete user
export const deleteUser = async ({
  headers,
  body,
}: {
  headers: Headers;
  body: I_UserUpdate;
}): Promise<void> => {
  try {
    if (!headers.authorization) {
      throw new Error('Authorization header is missing');
    }

    const decodedJwt = await decodedJwtToken(headers.authorization);
    const user = await UserModel.findById(decodedJwt.id);

    if (!user) {
      throw new Error('User not found');
    }

    // Validate email and password
    if (body.email !== user.email) {
      throw new Error('Email is invalid');
    }
    const isValid = await bcrypt.compare(body.password!, user.password);
    if (!isValid) {
      throw new Error('Password is invalid');
    }
    if (user.role === 'sitter') {
      await sitterService.deleteSitter(user.profileId);
    }
    if (user.role === 'owner') {
      await ownerService.deleteOwner(user.profileId);
    }
    // Delete the user and their profile
    await UserModel.findByIdAndDelete(user._id);

    // Check if authorization header is present
    // if (!headers || !headers.authorization) {
    //   throw new Error('Authorization header is missing');
    // }

    // const users = db.collection('users');

    // // Decode the JWT token to get the user ID
    // const decodedJwt = await decodedJwtToken(headers.authorization);
    // const userId = new ObjectId(decodedJwt.id);

    // const user = await users.findOne({ _id: userId });
    // if (!user) {
    //   throw new Error('User not found');
    // }

    // // Validate email and password
    // if (body.email !== user.email) {
    //   throw new Error('Email is invalid');
    // }
    // const isValid = await bcrypt.compare(body.password!, user.password);
    // if (!isValid) {
    //   throw new Error('Password is invalid');
    // }

    // // Delete the user and their profile
    // await users.deleteOne({ _id: user._id });
    // await profileService.deleteProfile(user.profileId);
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    throw new Error(error.message);
  }
};
