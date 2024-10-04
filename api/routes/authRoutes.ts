import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateToken } from '../middleware/tokenValidation.js';

const authRouter = Router();
authRouter
  .route('')
  .post(authController.login)
  .patch(validateToken, authController.updateLog);

export default authRouter;
