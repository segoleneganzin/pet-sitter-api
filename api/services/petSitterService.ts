import { deleteFile } from '../utils/deleteFile';
import { Request, Response } from 'express';
import { ObjectId, ReturnDocument } from 'mongodb';
import { dbInstance as db } from '../database/connection';
import { profileAccess } from '../utils/profileAccess';
import { IncomingHttpHeaders } from 'http';

interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}

interface I_PetSitterDocument {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  city: string;
}

interface I_Body {
  firstName: string;
  lastName: string;
  city: string;
}

// Service to create a new PetSitter
export const createPetSitter = async (
  serviceData: I_PetSitterDocument
): Promise<void> => {
  try {
    const petSitters = db.collection('pet-sitters');

    const newPetSitter = {
      firstName: serviceData.firstName,
      lastName: serviceData.lastName,
      city: serviceData.city,
    };

    await petSitters.insertOne(newPetSitter);
  } catch (error: any) {
    console.error('Error in createPetSitter:', error.message);
    throw new Error(error.message);
  }
};

// Service to get all PetSitters
export const getAllPetSitters = async (): Promise<I_PetSitterDocument[]> => {
  try {
    const petSitters = db.collection('pet-sitters');

    // Retrieve all PetSitters from the database
    const petSittersList = (await petSitters
      .find({})
      .toArray()) as I_PetSitterDocument[];
    return petSittersList;
  } catch (error: any) {
    console.error('Error in getAllPetSitters:', error.message);
    throw new Error('Failed to retrieve PetSitters. Please try again later.');
  }
};

// Service to get a PetSitter by petSitterId
export const getPetSitter = async (req: Request, res: Response) => {
  try {
    const petSitters = db.collection('pet-sitters');
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }
    const petSitterIdFormatted = new ObjectId(id);
    const petSitter = await petSitters.findOne({ _id: petSitterIdFormatted });
    if (!petSitter) {
      throw new Error('PetSitter not found');
    }
    return petSitter;
  } catch (error: any) {
    console.error('Error in getPetSitter:', error.message);
    throw new Error(error.message);
  }
};

export const getEmail = async (req: Request, res: Response) => {
  try {
    const users = db.collection('users');
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }
    const petSitterIdFormatted = new ObjectId(id);
    const user = await users.findOne({ petSitterId: petSitterIdFormatted });
    if (!user) {
      throw new Error('Email not found');
    }
    return user.email;
  } catch (error: any) {
    console.error('Error in getEmail:', error.message);
    throw new Error(error.message);
  }
};

export const updatePetSitter = async ({
  headers,
  body,
}: {
  headers: Headers;
  body: I_Body;
}): Promise<I_PetSitterDocument> => {
  try {
    // Check if authorization header is present
    if (!headers || !headers.authorization) {
      throw new Error('Authorization header is missing');
    }
    const petSitters = db.collection('pet-sitters');
    const petSitter = await profileAccess(headers.authorization);
    const updateData: Partial<I_Body> = {
      firstName: body.firstName,
      lastName: body.lastName,
      city: body.city,
    };

    const options = { returnDocument: ReturnDocument.AFTER };
    const updatedPetSitter = await petSitters.findOneAndUpdate(
      { email: petSitter.email },
      { $set: updateData },
      options
    );

    if (!updatedPetSitter) {
      throw new Error('User not found');
    }

    return updatedPetSitter.value as I_PetSitterDocument;
  } catch (error: any) {
    console.error('Error in updateUser:', error.message);
    throw new Error(error.message);
  }
};

// Service to delete a PetSitter
export const deletePetSitter = async (petSitterId: string): Promise<void> => {
  try {
    const petSitters = db.collection('pet-sitters');

    // Find the PetSitter to delete
    const petSitterIdFormatted = new ObjectId(petSitterId);
    const petSitter = await petSitters.findOne({ _id: petSitterIdFormatted });
    if (!petSitter) {
      throw new Error('Pet Sitter not found');
    }
    // Delete the PetSitter from the database
    await petSitters.deleteOne({ _id: petSitterIdFormatted });
  } catch (error: any) {
    console.error('Error in deletePetSitter:', error.message);
    throw new Error(error.message);
  }
};
