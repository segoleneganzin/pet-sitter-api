import { Request, Response } from 'express';
import * as ownerService from '../services/ownerService';
import { handleResponse } from '../utils/utilsController';

export const getAllOwners = (req: Request, res: Response) => {
  const successMessage = 'Owners retrieved successfully';
  handleResponse(
    'ownerController',
    res,
    ownerService.getAllOwners(),
    successMessage
  );
};

export const getOwnerById = async (req: Request, res: Response) => {
  const successMessage = 'Owner retrieved successfully';
  handleResponse(
    'ownerController',
    res,
    ownerService.getOwnerById(req),
    successMessage
  );
};
