import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { handleResponseCreate, handleResponse } from '../utils/utilsController';

export const createUser = (req: Request, res: Response) => {
  handleResponseCreate('userController', res, userService.createUser(req));
};

export const getUser = (req: Request, res: Response) => {
  const successMessage = 'User retrieved successfully';
  handleResponse(
    'userController',
    res,
    userService.getUser(req.headers),
    successMessage
  );
};

export const getUserEmail = async (req: Request, res: Response) => {
  const successMessage = 'User email retrieved successfully';
  handleResponse(
    'sitterController',
    res,
    userService.getUserEmail(req),
    successMessage
  );
};

export const updateUser = (req: Request, res: Response) => {
  const successMessage = 'User updated successully';
  handleResponse(
    'userController',
    res,
    userService.updateUser({
      headers: req.headers,
      body: req.body,
    }),
    successMessage
  );
};

export const deleteUser = (req: Request, res: Response) => {
  const successMessage = '';
  handleResponse(
    'userController',
    res,
    userService.deleteUser({
      headers: req.headers,
      body: req.body,
    }),
    successMessage
  );
};
