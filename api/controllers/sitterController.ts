import { Request, Response } from 'express';
import * as sitterService from '../services/sitterService.js';
import { handleResponse } from '../utils/utilsController.js';

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
