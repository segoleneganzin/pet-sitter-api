import { Request, Response } from 'express';
import * as sitterService from '../services/sitterService';
import { handleResponse } from '../utils/utilsController';

export const getAllSitters = (req: Request, res: Response) => {
  const successMessage = 'Sitters retrieved successfully';
  handleResponse(
    'sitterController',
    res,
    sitterService.getAllSitters(),
    successMessage
  );
};

export const getSitterById = async (req: Request, res: Response) => {
  const successMessage = 'Sitter retrieved successfully';
  handleResponse(
    'sitterController',
    res,
    sitterService.getSitterById(req),
    successMessage
  );
};

export const updateSitter = (req: Request, res: Response) => {
  const successMessage = 'Sitter updated successfully';
  handleResponse(
    'sitterController',
    res,
    sitterService.updateSitter(req),
    successMessage
  );
};
