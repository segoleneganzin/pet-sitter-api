import { Request, Response } from 'express';
import * as petSitterService from '../services/petSitterService';
import { handleResponse } from './generalController';

// Controller function to get all pet sitters
export const getAllPetSitters = (req: Request, res: Response) => {
  try {
    handleResponse(
      'petSitterController',
      res,
      petSitterService.getAllPetSitters()
    );
  } catch (error) {
    console.error('Error in getAllPetSitters:', (error as Error).message);
    // Optionally, send an error response to the client if needed
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

// Controller function to get a specific pet sitter
export const getPetSitter = async (req: Request, res: Response) => {
  try {
    // Call the service and handle the response
    handleResponse(
      'petSitterController',
      res,
      petSitterService.getPetSitter(req, res)
    );
  } catch (error) {
    console.error('Error in getPetSitter:', (error as Error).message);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

export const getEmail = async (req: Request, res: Response) => {
  try {
    handleResponse(
      'petSitterController',
      res,
      petSitterService.getEmail(req, res)
    );
  } catch (error: any) {
    console.error('Error in getUserEmail :', error.message);
  }
};

export const updatePetSitter = (req: Request, res: Response) => {
  handleResponse(
    'petSitterController',
    res,
    petSitterService.updatePetSitter({
      headers: req.headers,
      body: req.body,
    })
  );
};
