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
// Service to get a Sitter by id
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

export const updateSitter = async (req: Request): Promise<I_SitterDocument> => {
  try {
    const { headers, body, file, params } = req;
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    if (!headers || !headers.authorization) {
      throw new CustomError(401, 'Authorization header is missing');
    }
    const profileId = new mongoose.Types.ObjectId(id);
    await validProfileAccess({
      authHeader: headers.authorization,
      profileId,
    });
    const sitter = await SitterModel.findById(id);
    if (!sitter) {
      throw new CustomError(404, 'Sitter not found');
    }
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
    const updateData: Partial<I_Sitter> = {
      profilePicture: body.profilePicture,
      firstName: body.firstName,
      lastName: body.lastName,
      tel: body.tel,
      city: body.city,
      country: body.country,
      presentation: body.presentation,
      acceptedPets: body.acceptedPets,
    };

    const updatedSitter = await SitterModel.findByIdAndUpdate(
      profileId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedSitter) {
      throw new CustomError(404, 'Sitter not found');
    }

    return updatedSitter;
  } catch (error: any) {
    console.error('Error in updateSitter:', error.message);
    throw error;
  }
};

export const deleteSitter = async (
  sitterId: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    const sitter = await SitterModel.findById(sitterId);
    if (!sitter) {
      throw new CustomError(404, 'Sitter not found');
    }
    const profilePicture = `./public/uploads/profilePicture${sitter.profilePicture}`;
    deleteFile(profilePicture);
    const deletedSitter = await SitterModel.findByIdAndDelete(sitterId);
    if (!deletedSitter) {
      throw new CustomError(404, 'Sitter not found');
    }
  } catch (error: any) {
    console.error('Error in deleteSitter:', error.message);
    throw error;
  }
};
