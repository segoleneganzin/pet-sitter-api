import bcrypt from 'bcrypt';
import { I_UserDocument } from '../database/models/userModel';
import { CustomError } from './customError';
import { deleteFile } from './deleteFile';
import { capitalizeFirstLetter } from './formatWord';

export const handleRoleData = (body: any) => {
  if (typeof body.roles === 'string') {
    body.roles = body.roles.split(',').map((role: string) => role.trim());
  }
  if (body.roles.includes('sitter') && typeof body.acceptedPets === 'string') {
    body.acceptedPets = body.acceptedPets
      .split(',')
      .map((pet: string) => pet.trim());
  }
  if (body.roles.includes('owner') && typeof body.pets === 'string') {
    body.pets = body.pets.split(',').map((pet: string) => pet.trim());
  }
};

export const prepareUserData = (body: any, file: any): any => {
  const userData: any = {
    email: body.email,
    password: body.password,
    roles: body.roles,
    profilePicture: file ? `/${file.filename}` : '/default-profile-picture.png',
    firstName: capitalizeFirstLetter(body.firstName),
    lastName: capitalizeFirstLetter(body.lastName),
    city: capitalizeFirstLetter(body.city),
    country: capitalizeFirstLetter(body.country),
  };

  if (body.roles.includes('sitter')) {
    userData.roleDetails = {
      sitter: {
        tel: body.tel,
        presentation: body.presentation,
        acceptedPets: body.acceptedPets,
      },
    };
  }

  if (body.roles.includes('owner')) {
    userData.roleDetails = {
      ...userData.roleDetails,
      owner: {
        pets: body.pets,
      },
    };
  }

  return userData;
};

export const validateRoleData = (body: any) => {
  if (body.roles.includes('sitter')) {
    if (!body.tel) {
      throw new CustomError(400, 'Telephone number is required for sitters');
    }
    if (!body.presentation) {
      throw new CustomError(400, 'Presentation is required for sitters');
    }
    if (!body.acceptedPets) {
      throw new CustomError(400, 'Accepted pets are required for sitters');
    }
  }

  if (body.roles.includes('owner')) {
    if (!body.pets) {
      throw new CustomError(400, 'Pets are required for owners');
    }
  }
};
