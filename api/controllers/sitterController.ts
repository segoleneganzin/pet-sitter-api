import { Request, Response } from 'express';
import * as sitterService from '../services/sitterService';
import { handleResponse } from './generalController';

export const getAllSitters = (req: Request, res: Response) => {
  handleResponse('sitterController', res, sitterService.getAllSitters());
};

export const getSitterById = async (req: Request, res: Response) => {
  handleResponse('sitterController', res, sitterService.getSitterById(req));
};

export const updateSitter = (req: Request, res: Response) => {
  handleResponse(
    'sitterController',
    res,
    sitterService.updateSitter({
      headers: req.headers,
      body: req.body,
    })
  );
};
