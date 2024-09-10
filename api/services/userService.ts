import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId, ReturnDocument } from 'mongodb';
import { decodedJwtToken } from '../utils/decodedJwtToken';
import * as petSitterService from './petSitterService';
import { dbInstance as db } from '../database/connection';
import { IncomingHttpHeaders } from 'http';

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}

interface I_UserDocument {
  _id?: ObjectId;
  email: string;
  password: string;
  petSitterId?: ObjectId;
}

interface I_ServiceDataCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
}

interface I_Body {
  email?: string;
  password?: string;
}

export const loginUser = async (
  serviceData: I_UserDocument
): Promise<{ token: string }> => {
  try {
    const users = db.collection('users');
    const user = (await users.findOne({
      email: serviceData.email,
    })) as I_UserDocument | null;
    if (!user) {
      throw new Error('User not found!');
    }

    const isValid = await bcrypt.compare(serviceData.password, user.password);
    if (!user || !isValid) {
      throw new Error('Invalid combination');
    }

    const token = jwt.sign(
      { id: (user._id as ObjectId).toString() },
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
  serviceData: I_ServiceDataCreate
): Promise<I_UserDocument> => {
  try {
    const users = db.collection('users');
    const petSitters = db.collection('pet-sitters');

    const { email, password, firstName, lastName, city } = serviceData;

    // Check if email already exists
    const existingEmail = await users.findOne({ email });
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    if (!password) {
      throw new Error('Password is required');
    }
    // Create a new profile associated with the user
    const newPetSitter = await petSitters.insertOne({
      firstName,
      lastName,
      city,
    });

    const newPetSitterId = newPetSitter.insertedId;

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 12);

    // Create a new User document
    const newUser = {
      email,
      password: hashPassword,
      petSitterId: newPetSitterId,
    };

    // Save the new user into the database
    await users.insertOne(newUser);
    return newUser;
  } catch (error: any) {
    console.error('Error in createUser:', error.message);
    throw new Error(error.message);
  }
};

// Service to get user details
export const getUser = async (headers: Headers): Promise<I_UserDocument> => {
  try {
    // Check if authorization header is present
    if (!headers || !headers.authorization) {
      throw new Error('Authorization header is missing');
    }

    const users = db.collection('users');
    // Decode the JWT token to get the user ID
    const decodedJwt = await decodedJwtToken(headers.authorization);
    if (!ObjectId.isValid(decodedJwt.id)) {
      throw new Error('Invalid user ID');
    }

    const userId = new ObjectId(decodedJwt.id);
    const user = (await users.findOne({
      _id: userId,
    })) as I_UserDocument | null;

    if (!user) {
      console.error('User not found with id:', userId);
      throw new Error('User not found!');
    }

    return user;
  } catch (error: any) {
    console.error('Error in getUser:', error);
    throw new Error(error);
  }
};

// Service to update user details
export const updateUser = async ({
  headers,
  body,
}: {
  headers: Headers;
  body: I_Body;
}): Promise<I_UserDocument> => {
  try {
    // Check if authorization header is present
    if (!headers || !headers.authorization) {
      throw new Error('Authorization header is missing');
    }

    const users = db.collection('users');

    // Decode the JWT token to get the user ID
    const decodedJwt = await decodedJwtToken(headers.authorization);
    if (!ObjectId.isValid(decodedJwt.id)) {
      throw new Error('Invalid user ID');
    }

    const userId = new ObjectId(decodedJwt.id);
    const updateData: Partial<I_Body> = {};

    // Update email if provided
    if (body.email) {
      const existingEmail = await users.findOne({ email: body.email });
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

    const options = { returnDocument: ReturnDocument.AFTER };
    const updatedUser = await users.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      options
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser.value as I_UserDocument;
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
  body: I_Body;
}): Promise<void> => {
  try {
    // Check if authorization header is present
    if (!headers || !headers.authorization) {
      throw new Error('Authorization header is missing');
    }

    const users = db.collection('users');

    // Decode the JWT token to get the user ID
    const decodedJwt = await decodedJwtToken(headers.authorization);
    const userId = new ObjectId(decodedJwt.id);

    const user = await users.findOne({ _id: userId });
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

    // Delete the user and their profile
    await users.deleteOne({ _id: user._id });
    await petSitterService.deletePetSitter(user.petSitterId);
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    throw new Error(error.message);
  }
};
