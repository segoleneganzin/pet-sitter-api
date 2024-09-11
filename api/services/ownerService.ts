import { deleteFile } from '../utils/deleteFile';
import { Request } from 'express';
import mongoose from 'mongoose';
import { profileAccess } from '../utils/profileAccess';
import { IncomingHttpHeaders } from 'http';
import {
  I_OwnerDocument,
  I_Owner,
  OwnerModel,
} from '../database/models/ownerModel';

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}

// Service to create a new Sitter
export const createOwner = async (
  serviceData: I_Owner
): Promise<I_OwnerDocument> => {
  try {
    const newOwner = new OwnerModel(serviceData);
    await newOwner.save();
    return newOwner;
  } catch (error: any) {
    console.error('Error in createOwner:', error.message);
    throw new Error(error.message);
  }
};

export const getAllOwners = async (): Promise<I_OwnerDocument[]> => {
  try {
    const ownersList = await OwnerModel.find({});
    return ownersList;
  } catch (error: any) {
    console.error('Error in getAllOwners:', error.message);
    throw new Error('Failed to retrieve owners. Please try again later.');
  }
};
// Service to get a owner by id
export const getOwnerById = async (req: Request): Promise<I_OwnerDocument> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const owner = await OwnerModel.findById(id);
    if (!owner) {
      throw new Error('Owner not found');
    }
    return owner;
  } catch (error: any) {
    console.error('Error in getOwnerById:', error.message);
    throw new Error(error.message);
  }
};

export const updateOwner = async ({
  headers,
  body,
}: {
  headers: Headers;
  body: I_Owner;
}): Promise<I_OwnerDocument> => {
  try {
    if (!headers || !headers.authorization) {
      throw new Error('Authorization header is missing');
    }
    const owner = await profileAccess(headers.authorization);
    if (!owner) {
      throw new Error('Owner not found');
    }
    const updateData: Partial<I_Owner> = {
      firstName: body.firstName,
      lastName: body.lastName,
      city: body.city,
      country: body.country,
      pets: body.pets,
    };
    const updatedOwner = await OwnerModel.findByIdAndUpdate(
      owner._id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedOwner) {
      throw new Error('Owner not found');
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
    const deletedOwner = await OwnerModel.findByIdAndDelete(ownerId);
    if (!deletedOwner) {
      throw new Error('Owner not found');
    }
  } catch (error: any) {
    console.error('Error in deleteOwner:', error.message);
    throw new Error(error.message);
  }
};
