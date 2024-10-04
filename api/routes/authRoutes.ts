import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateToken } from '../middleware/tokenValidation';

const authRouter = Router();
authRouter
  .route('')
  .post(authController.login)
  .patch(validateToken, authController.updateLog);

export default authRouter;
