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
import { capitalizeFirstLetter } from '../utils/formatWord';

interface ExtendsRequest extends Request {
  token?: { id: string };
}

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

    serviceData.firstName = capitalizeFirstLetter(serviceData.firstName);
    serviceData.lastName = capitalizeFirstLetter(serviceData.lastName);
    serviceData.city = capitalizeFirstLetter(serviceData.city);
    serviceData.country = capitalizeFirstLetter(serviceData.country);

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
      throw new CustomError(400, 'Invalid ID supplied');
    }
    const owner = await OwnerModel.findById(id);
    if (!owner) {
      throw new CustomError(404, 'Owner not found');
    }
    return owner;
  } catch (error: any) {
    console.error('Error in getOwnerById:', error.message);
    throw error;
  }
};

export const updateOwner = async (
  req: ExtendsRequest
): Promise<I_OwnerDocument> => {
  try {
    const { body, file, params, token } = req;
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, 'Invalid ID supplied');
    }
    // if (!headers || !headers.authorization) {
    //   throw new CustomError(401, 'Authorization header is missing');
    // }

    const owner = await OwnerModel.findById(id);
    if (!owner) {
      throw new CustomError(404, 'Owner not found');
    }

    const userId = owner.userId;

    await validProfileAccess({
      tokenId: token?.id,
      userId: owner.userId,
    });

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
    owner.firstName = body.firstName || owner.firstName;
    owner.lastName = body.lastName || owner.lastName;
    owner.city = body.city || owner.city;
    owner.country = body.country || owner.country;
    owner.pets = body.pets || owner.pets;

    const updatedOwner = await owner.save();

    return updatedOwner;
  } catch (error: any) {
    console.error('Error in updateOwner:', error.message);
    throw new Error(error.message);
  }
};

export const deleteOwner = async (
  id: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    const owner = await OwnerModel.findById(id);
    if (!owner) {
      throw new CustomError(404, 'Owner not found');
    }
    const profilePicture = `./public/uploads/profilePicture${owner.profilePicture}`;
    deleteFile(profilePicture);
    const deletedOwner = await OwnerModel.findByIdAndDelete(id);
    if (!deletedOwner) {
      throw new CustomError(404, 'Owner not found');
    }
  } catch (error: any) {
    console.error('Error in deleteOwner:', error.message);
    throw error;
  }
};
