import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomError } from './customError';

interface DecodedToken extends JwtPayload {
  id: string;
}

export const decodedJwtToken = async (
  authHeader: string
): Promise<DecodedToken> => {
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }
  const jwtToken = authHeader.split('Bearer ')[1];
  if (!jwtToken) {
    throw new CustomError(401, 'Token is missing');
  }

  // Decode the JWT token
  const decodedJwtToken = jwt.decode(jwtToken) as JwtPayload | null;

  if (!decodedJwtToken || typeof decodedJwtToken === 'string') {
    throw new CustomError(400, 'Invalid JWT token');
  }

  // Type assertion to ensure decodedJwtToken has id
  if (!('id' in decodedJwtToken)) {
    throw new CustomError(401, 'JWT token does not contain an id');
  }

  return decodedJwtToken as DecodedToken;
};
