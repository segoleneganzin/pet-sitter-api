import { Request } from 'express';
import mongoose from 'mongoose';
import { CustomError } from '../utils/customError.js';
import { I_UserDocument, UserModel } from '../database/models/userModel.js';

export const getAllSitters = async (): Promise<I_UserDocument[]> => {
  try {
    const sitters = await UserModel.find({ roles: 'sitter' });
    return sitters;
  } catch (error: any) {
    console.error('Error in getAllSitters:', error.message);
    throw new CustomError(
      500,
      'Failed to retrieve Sitters. Please try again later.'
    );
  }
};

export const getSitterById = async (req: Request): Promise<I_UserDocument> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    const sitter = await UserModel.findById(id);
    if (!sitter) {
      throw new CustomError(404, 'Sitter not found');
    }
    return sitter;
  } catch (error: any) {
    console.error('Error in getSitterById:', error.message);
    throw error;
  }
};

// TODO delete sitter role
