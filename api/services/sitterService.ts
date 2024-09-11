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

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}

// Service to create a new Sitter
export const createSitter = async (
  serviceData: I_Sitter
): Promise<I_SitterDocument> => {
  try {
    // const sitters = db.collection('pet-sitters');
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

export const updateSitter = async ({
  headers,
  body,
  req,
}: {
  headers: Headers;
  body: I_Sitter;
  req: Request;
}): Promise<I_SitterDocument> => {
  try {
    const { id } = req.params;
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

    const updateData: Partial<I_Sitter> = {
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
    const deletedSitter = await SitterModel.findByIdAndDelete(sitterId);
    if (!deletedSitter) {
      throw new Error('Sitter not found');
    }
  } catch (error: any) {
    console.error('Error in deleteSitter:', error.message);
    throw new Error(error.message);
  }
};
