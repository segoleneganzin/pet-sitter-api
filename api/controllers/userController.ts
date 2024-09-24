import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { handleResponseCreate, handleResponse } from '../utils/utilsController';

export const createUser = (req: Request, res: Response) => {
  handleResponseCreate('userController', res, userService.createUser(req));
};

export const getUserById = (req: Request, res: Response) => {
  const successMessage = 'User retrieved successfully';
  handleResponse(
    'userController',
    res,
    userService.getUserById(req),
    successMessage
  );
};

export const updateUser = (req: Request, res: Response) => {
  const successMessage = 'User updated successully';
  handleResponse(
    'userController',
    res,
    userService.updateUser(req),
    successMessage
  );
};

export const deleteUser = (req: Request, res: Response) => {
  const successMessage = '';
  handleResponse(
    'userController',
    res,
    userService.deleteUser(req),
    successMessage
  );
};
