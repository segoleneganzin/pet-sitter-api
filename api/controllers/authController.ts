import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { handleResponse } from '../utils/utilsController.js';

export const login = async (req: Request, res: Response) => {
  const successMessage = 'Successful login';
  handleResponse(
    'authController',
    res,
    authService.login(req.body),
    successMessage
  );
};

export const updateLog = async (req: Request, res: Response) => {
  const successMessage = 'Log updated successully';
  handleResponse(
    'authController',
    res,
    authService.updateLog(req),
    successMessage
  );
};
