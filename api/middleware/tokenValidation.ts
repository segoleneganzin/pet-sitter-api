import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

// Middleware to validate JWT tokens
export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the token is present in the headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Unauthorized: missing header');
    }

    // Extract the JWT token from the 'Authorization' header
    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      throw new Error('Unauthorized: missing token');
    }

    // Decode and verify the JWT token
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY || 'default-secret-key'
    );

    // Add the decoded token information to the request object
    (req as CustomRequest).token = decodedToken;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error in token validation:', error);
    return res.status(401).send({
      status: 401,
      message: 'Unauthorized: Invalid or missing token',
    });
  }
};
