import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { handleResponseCreate, handleResponse } from './generalController';

export const loginUser = async (req: Request, res: Response) => {
  handleResponse('loginController', res, userService.loginUser(req.body));
};

export const createUser = (req: Request, res: Response) => {
  handleResponseCreate('userController', res, userService.createUser(req.body));
};

export const getUser = (req: Request, res: Response) => {
  handleResponse('userController', res, userService.getUser(req.headers));
};

export const getUserEmail = async (req: Request, res: Response) => {
  handleResponse('sitterController', res, userService.getUserEmail(req, res));
};

export const updateUser = (req: Request, res: Response) => {
  handleResponse(
    'userController',
    res,
    userService.updateUser({
      headers: req.headers,
      body: req.body,
    })
  );
};

export const deleteUser = (req: Request, res: Response) => {
  handleResponse(
    'userController',
    res,
    userService.deleteUser({
      headers: req.headers,
      body: req.body,
    })
  );
};
