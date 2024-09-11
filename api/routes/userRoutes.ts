import { Router } from 'express';
import * as userController from '../controllers/userController';
import { validateToken } from '../middleware/tokenValidation';
import { upload, handleError } from '../middleware/uploadMiddleware';

const userRouter = Router();

// Route to login a user
userRouter.post('/login', userController.loginUser);

// Route to get user email by profileId
// ownerId or sitterId (correspond to user profileId)
userRouter.get('/:profileId/email', userController.getUserEmail);

userRouter
  .route('')
  .post(upload.single('profilePicture'), userController.createUser, handleError)
  .get(validateToken, userController.getUser) // user id is in token
  .patch(validateToken, userController.updateUser)
  .delete(validateToken, userController.deleteUser);

export default userRouter;
