import { deleteFile } from '../utils/deleteFile';
import { Request } from 'express';
import mongoose from 'mongoose';
import { validProfileAccess } from '../utils/validProfileAccess';
import { CustomError } from '../utils/customError';
import {
  I_OwnerDocument,
  I_Owner,
  OwnerModel,
} from '../database/models/ownerModel';
import { I_UserCreate } from '../database/models/userModel';

// Service to create a new Sitter
export const createOwner = async (
  serviceData: I_UserCreate
): Promise<I_OwnerDocument> => {
  try {
    if (typeof serviceData.pets === 'string') {
      serviceData.pets = serviceData.pets
        .split(',')
        .map((pet: string) => pet.trim());
    }
    const newOwner = new OwnerModel(serviceData);
    await newOwner.save();
    return newOwner;
  } catch (error: any) {
    console.error('Error in createOwner:', error.message);
    throw new CustomError(500, 'Owner creation failed');
  }
};

export const getAllOwners = async (): Promise<I_OwnerDocument[]> => {
  try {
    const ownersList = await OwnerModel.find({});
    return ownersList;
  } catch (error: any) {
    console.error('Error in getAllOwners:', error.message);
    throw new CustomError(
      500,
      'Failed to retrieve Owners. Please try again later.'
    );
  }
};

export const getOwnerById = async (req: Request): Promise<I_OwnerDocument> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID format');
    }
    const owner = await OwnerModel.findById(id);
    if (!owner) {
      throw new CustomError(404, 'Owner not found!');
    }
    return owner;
  } catch (error: any) {
    console.error('Error in getOwnerById:', error.message);
    throw error;
  }
};

export const updateOwner = async (req: Request): Promise<I_OwnerDocument> => {
  try {
    const { headers, body, file, params } = req;
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID format');
    }
    if (!headers || !headers.authorization) {
      throw new CustomError(401, 'Authorization header is missing');
    }
    const profileId = new mongoose.Types.ObjectId(id);
    await validProfileAccess({
      authHeader: headers.authorization,
      profileId,
    });
    const owner = await OwnerModel.findById(id);
    if (!owner) {
      throw new CustomError(404, 'Owner not found!');
    }
    if (file) {
      const oldImagePath = `./public/uploads/profilePicture${owner.profilePicture}`;
      deleteFile(oldImagePath);
      body.profilePicture = `/${file.filename}`;
    } else {
      body.profilePicture = owner.profilePicture;
    }
    if (typeof body.pets === 'string') {
      body.pets = body.pets.split(',');
    }
    const updateData: Partial<I_Owner> = {
      profilePicture: body.profilePicture,
      firstName: body.firstName,
      lastName: body.lastName,
      city: body.city,
      country: body.country,
      pets: body.pets,
    };
    const updatedOwner = await OwnerModel.findByIdAndUpdate(
      profileId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedOwner) {
      throw new CustomError(404, 'Owner not found!');
    }

    return updatedOwner;
  } catch (error: any) {
    console.error('Error in updateOwner:', error.message);
    throw new Error(error.message);
  }
};

export const deleteOwner = async (
  ownerId: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    const owner = await OwnerModel.findById(ownerId);
    if (!owner) {
      throw new CustomError(404, 'Owner not found!');
    }
    const profilePicture = `./public/uploads/profilePicture${owner.profilePicture}`;
    deleteFile(profilePicture);
    const deletedOwner = await OwnerModel.findByIdAndDelete(ownerId);
    if (!deletedOwner) {
      throw new CustomError(404, 'Owner not found!');
    }
  } catch (error: any) {
    console.error('Error in deleteOwner:', error.message);
    throw error;
  }
};
