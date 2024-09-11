import { Response } from 'express';

interface Error {
  status?: number;
  message?: string;
}

// Function to handle errors and send a response
const handleError = (controller: string, res: Response, error: Error) => {
  console.error(`Something went wrong in ${controller}`, error);
  res.status(error.status || 500).send({
    status: error.status || 500,
    message: error.message || 'Internal Server Error',
  });
};

// Function to handle successful responses for general cases
export const handleResponse = <T>(
  controller: string,
  res: Response,
  promise: Promise<T>
) => {
  promise
    .then((responseFromService: T) => {
      res.status(200).send({
        status: 200,
        message: 'Success',
        body: responseFromService,
      });
    })
    .catch((error: Error) => handleError(controller, res, error));
};

// Function to handle successful responses for creation cases
export const handleResponseCreate = <T>(
  controller: string,
  res: Response,
  promise: Promise<T>
) => {
  promise
    .then((responseFromService: T) => {
      res.status(201).send({
        status: 201,
        message: 'Resource created successfully',
        body: responseFromService,
      });
    })
    .catch((error: Error) => handleError(controller, res, error));
};
