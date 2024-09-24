import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomError } from '../utils/customError';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

// Middleware to validate JWT tokens
export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new CustomError(400, 'Authorization header missing');
    }
    const jwtToken = authHeader.split('Bearer ')[1]?.trim();
    if (!jwtToken) {
      throw new CustomError(401, 'Unauthorized: missing token');
    }

    const secretKey = process.env.SECRET_KEY || 'default-secret-key';

    // Decode and verify the JWT token
    const decodedJwtToken = jwt.verify(jwtToken, secretKey) as JwtPayload;
    console.log('decodedToken : ', decodedJwtToken);

    // Type assertion to ensure decodedJwtToken has id
    if (!('id' in decodedJwtToken)) {
      throw new CustomError(401, 'JWT token does not contain an id');
    }

    // Add the decoded token information to the request object
    (req as CustomRequest).token = decodedJwtToken;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error in token validation:', error);
    return res.status(401).send({
      status: 401,
      message: 'Unauthorized: Invalid or missing token',
    });
  }
};
