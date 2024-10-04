import bcrypt from 'bcrypt';
import { Request } from 'express';
import mongoose from 'mongoose';
import { CustomError } from '../utils/customError.js';
import { I_UserDocument, UserModel } from '../database/models/userModel.js';
import { deleteFile } from '../utils/deleteFile.js';
import { capitalizeFirstLetter } from '../utils/formatWord.js';
import {
  handleRoleData,
  prepareUserData,
  validateRoleData,
} from '../utils/utilsUser.js';

interface ExtendsRequest extends Request {
  token?: { id: string };
}

export const createUser = async (req: Request): Promise<I_UserDocument> => {
  try {
    const { body, file } = req;

    // Check if email already exists
    if (await UserModel.findOne({ email: body.email })) {
      throw new CustomError(409, 'Email already exists');
    }
    if (!body.password) {
      throw new CustomError(400, 'Password is required');
    }

    validateRoleData(body);

    const hashPassword = await bcrypt.hash(body.password, 12);
    body.password = hashPassword;

    handleRoleData(body);

    const newUser = new UserModel(prepareUserData(body, file));

    await newUser.save();
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
    console.error('Error in getUserById:', error);
    throw error;
  }
};

export const updateUser = async (
  req: ExtendsRequest
): Promise<I_UserDocument> => {
  try {
    const { body, file, token } = req;
    const user = await UserModel.findById(token?.id);

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    validateRoleData(body);

    handleRoleData(body);

    if (file) {
      const oldImagePath = `./public/uploads/profilePicture${user.profilePicture}`;
      deleteFile(oldImagePath);
      user.profilePicture = `/${file.filename}`;
    }

    user.firstName = capitalizeFirstLetter(body.firstName) || user.firstName;
    user.lastName = capitalizeFirstLetter(body.lastName) || user.lastName;
    user.city = capitalizeFirstLetter(body.city) || user.city;
    user.country = capitalizeFirstLetter(body.country) || user.country;

    if (user.roles.includes('sitter') && user.roleDetails.sitter) {
      user.roleDetails.sitter.tel = body.tel || user.roleDetails.sitter.tel;
      user.roleDetails.sitter.presentation =
        body.presentation || user.roleDetails.sitter.presentation;
      user.roleDetails.sitter.acceptedPets =
        body.acceptedPets || user.roleDetails.sitter.acceptedPets;
    }

    if (user.roles.includes('owner') && user.roleDetails.owner) {
      user.roleDetails.owner.pets = body.pets || user.roleDetails.owner.pets;
    }

    const updatedUser = await user.save();
    if (!updatedUser) {
      throw new CustomError(404, 'User not found');
    }
    return updatedUser;
  } catch (error: any) {
    console.error('Error in updateUser:', error.message);
    throw error;
  }
};

export const deleteUser = async (req: ExtendsRequest): Promise<void> => {
  try {
    const { token } = req;

    const user = await UserModel.findById(token?.id);

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // const isValid = await bcrypt.compare(body.password, user.password);

    // if (body.email !== user.email || !isValid) {
    //   throw new CustomError(400, 'Invalid email/password supplied');
    // }

    await UserModel.findByIdAndDelete(user.id);
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    throw error;
  }
};
