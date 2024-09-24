import { Router } from 'express';
import * as userController from '../controllers/userController';
import { validateToken } from '../middleware/tokenValidation';
import { upload, handleError } from '../middleware/uploadMiddleware';

const userRouter = Router();

userRouter.get('/:id', userController.getUserById);

userRouter
  .route('')
  .post(upload.single('profilePicture'), userController.createUser, handleError)
  .patch(validateToken, userController.updateUser)
  .delete(validateToken, userController.deleteUser);

export default userRouter;
