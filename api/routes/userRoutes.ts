import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { validateToken } from '../middleware/tokenValidation.js';
import { upload, handleError } from '../middleware/uploadMiddleware.js';

const userRouter = Router();

userRouter.get('/:id', userController.getUserById);

userRouter
  .route('')
  .post(upload.single('profilePicture'), userController.createUser, handleError)
  .patch(
    validateToken,
    upload.single('profilePicture'),
    userController.updateUser
  )
  .delete(validateToken, userController.deleteUser);

export default userRouter;
