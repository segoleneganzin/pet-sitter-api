import { Request } from 'express';
import mongoose from 'mongoose';
import { CustomError } from '../utils/customError.js';
import { I_UserDocument, UserModel } from '../database/models/userModel.js';

export const getAllOwners = async (): Promise<I_UserDocument[]> => {
  try {
    const owners = await UserModel.find({ roles: 'owner' });
    return owners;
  } catch (error: any) {
    console.error('Error in getAllOwners:', error.message);
    throw new CustomError(
      500,
      'Failed to retrieve Owners. Please try again later.'
    );
  }
};

export const getOwnerById = async (req: Request): Promise<I_UserDocument> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    const owner = await UserModel.findById(id);
    if (!owner) {
      throw new CustomError(404, 'Owner not found');
    }
    return owner;
  } catch (error: any) {
    console.error('Error in getOwnerById:', error.message);
    throw error;
  }
};

// TODO delete owner role
