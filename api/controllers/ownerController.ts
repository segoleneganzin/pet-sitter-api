import { Request, Response } from 'express';
import * as ownerService from '../services/ownerService';
import { handleResponse } from './generalController';

export const getAllOwners = (req: Request, res: Response) => {
  handleResponse('ownerController', res, ownerService.getAllOwners());
};

export const getOwnerById = async (req: Request, res: Response) => {
  handleResponse('ownerController', res, ownerService.getOwnerById(req));
};

export const updateOwner = (req: Request, res: Response) => {
  handleResponse(
    'ownerController',
    res,
    ownerService.updateOwner({
      headers: req.headers,
      body: req.body,
    })
  );
};
