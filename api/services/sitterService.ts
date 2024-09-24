import { deleteFile } from '../utils/deleteFile';
import { Request } from 'express';
import mongoose from 'mongoose';
import { validProfileAccess } from '../utils/validProfileAccess';
import { CustomError } from '../utils/customError';
import {
  I_SitterDocument,
  I_Sitter,
  SitterModel,
} from '../database/models/sitterModel';
import { I_UserCreate } from '../database/models/userModel';
import { capitalizeFirstLetter } from '../utils/formatWord';

interface ExtendsRequest extends Request {
  token?: { id: string };
}

// Service to create a new Sitter
export const createSitter = async (
  serviceData: I_UserCreate
): Promise<I_SitterDocument> => {
  try {
    if (typeof serviceData.acceptedPets === 'string') {
      serviceData.acceptedPets = serviceData.acceptedPets
        .split(',')
        .map((pet: string) => pet.trim());
    }

    serviceData.firstName = capitalizeFirstLetter(serviceData.firstName);
    serviceData.lastName = capitalizeFirstLetter(serviceData.lastName);
    serviceData.city = capitalizeFirstLetter(serviceData.city);
    serviceData.country = capitalizeFirstLetter(serviceData.country);

    const newSitter = new SitterModel(serviceData);
    await newSitter.save();
    return newSitter;
  } catch (error: any) {
    console.error('Error in createSitter:', error.message);
    throw new CustomError(500, 'Sitter creation failed');
  }
};

export const getAllSitters = async (): Promise<I_SitterDocument[]> => {
  try {
    const sittersList = await SitterModel.find({});
    return sittersList;
  } catch (error: any) {
    console.error('Error in getAllSitters:', error.message);
    throw new CustomError(
      500,
      'Failed to retrieve Sitters. Please try again later.'
    );
  }
};

export const getSitterById = async (
  req: Request
): Promise<I_SitterDocument> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    const sitter = await SitterModel.findById(id);
    if (!sitter) {
      throw new CustomError(404, 'Sitter not found');
    }
    return sitter;
  } catch (error: any) {
    console.error('Error in getSitterById:', error.message);
    throw error;
  }
};

export const getSitterByUserId = async (
  req: Request
): Promise<I_SitterDocument> => {
  try {
    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    const sitter = await SitterModel.findOne({ userId });
    if (!sitter) {
      throw new CustomError(404, 'Sitter not found');
    }
    return sitter;
  } catch (error: any) {
    console.error('Error in getSitterById:', error.message);
    throw error;
  }
};

export const updateSitter = async (
  req: ExtendsRequest
): Promise<I_SitterDocument> => {
  try {
    const { body, file, params, token } = req;
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }

    const sitter = await SitterModel.findById(id);
    if (!sitter) {
      throw new CustomError(404, 'Sitter not found');
    }

    await validProfileAccess({
      tokenId: token?.id,
      userId: sitter.userId,
    });

    if (file) {
      const oldImagePath = `./public/uploads/profilePicture${sitter.profilePicture}`;
      deleteFile(oldImagePath);
      body.profilePicture = `/${file.filename}`;
    } else {
      body.profilePicture = sitter.profilePicture;
    }
    if (typeof body.acceptedPets === 'string') {
      body.acceptedPets = body.acceptedPets
        .split(',')
        .map((pet: string) => pet.trim());
    }

    sitter.firstName = body.firstName || sitter.firstName;
    sitter.lastName = body.lastName || sitter.lastName;
    sitter.tel = body.tel || sitter.tel;
    sitter.city = body.city || sitter.city;
    sitter.country = body.country || sitter.country;
    sitter.presentation = body.presentation || sitter.presentation;
    sitter.acceptedPets = body.acceptedPets || sitter.acceptedPets;

    const updatedSitter = await sitter.save();

    return updatedSitter;
  } catch (error: any) {
    console.error('Error in updateSitter:', error.message);
    throw error;
  }
};

export const deleteSitter = async (
  id: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    const sitter = await SitterModel.findById(id);
    if (!sitter) {
      throw new CustomError(404, 'Sitter not found');
    }
    const profilePicture = `./public/uploads/profilePicture${sitter.profilePicture}`;
    deleteFile(profilePicture);
    const deletedSitter = await SitterModel.findByIdAndDelete(id);
    if (!deletedSitter) {
      throw new CustomError(404, 'Sitter not found');
    }
  } catch (error: any) {
    console.error('Error in deleteSitter:', error.message);
    throw error;
  }
};
