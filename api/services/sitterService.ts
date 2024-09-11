import { deleteFile } from '../utils/deleteFile';
import { Request } from 'express';
import mongoose from 'mongoose';
// import { ObjectId, ReturnDocument } from 'mongodb';
// import { dbInstance as db } from '../database/connection';
import { validProfileAccess } from '../utils/validProfileAccess';
import { IncomingHttpHeaders } from 'http';
import {
  I_SitterDocument,
  I_Sitter,
  SitterModel,
} from '../database/models/sitterModel';
import { I_UserCreate } from '../database/models/userModel';

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
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
    const newSitter = new SitterModel(serviceData);
    await newSitter.save();
    return newSitter;
  } catch (error: any) {
    console.error('Error in createSitter:', error.message);
    throw new Error(error.message);
  }
};

export const getAllSitters = async (): Promise<I_SitterDocument[]> => {
  try {
    const sittersList = await SitterModel.find({});
    return sittersList;
  } catch (error: any) {
    console.error('Error in getAllSitters:', error.message);
    throw new Error('Failed to retrieve Sitters. Please try again later.');
  }
};
// Service to get a Sitter by id
export const getSitterById = async (
  req: Request
): Promise<I_SitterDocument> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const sitter = await SitterModel.findById(id);
    if (!sitter) {
      throw new Error('Sitter not found');
    }
    return sitter;
  } catch (error: any) {
    console.error('Error in getSitterById:', error.message);
    throw new Error(error.message);
  }
};

export const updateSitter = async (req: Request): Promise<I_SitterDocument> => {
  try {
    const { headers, body, file, params } = req;
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    if (!headers || !headers.authorization) {
      throw new Error('Authorization header is missing');
    }
    const profileId = new mongoose.Types.ObjectId(id);
    await validProfileAccess({
      authHeader: headers.authorization,
      profileId,
    });
    const sitter = await SitterModel.findById(id);
    if (!sitter) {
      throw new Error('Sitter not found');
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
      throw new Error('Sitter not found');
    }

    return updatedSitter;
  } catch (error: any) {
    console.error('Error in updateSitter:', error.message);
    throw new Error(error.message);
  }
};

export const deleteSitter = async (
  sitterId: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    const sitter = await SitterModel.findById(sitterId);
    if (!sitter) {
      throw new Error('Sitter not found');
    }
    console.log(sitter);

    const profilePicture = `./public/uploads/profilePicture${sitter.profilePicture}`;
    deleteFile(profilePicture);
    const deletedSitter = await SitterModel.findByIdAndDelete(sitterId);
    if (!deletedSitter) {
      throw new Error('Sitter not found');
    }
  } catch (error: any) {
    console.error('Error in deleteSitter:', error.message);
    throw new Error(error.message);
  }
};
