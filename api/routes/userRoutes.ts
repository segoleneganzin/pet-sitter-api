import { Router } from 'express';
import * as userController from '../controllers/userController';
import { validateToken } from '../middleware/tokenValidation';

const userRouter = Router();

// Route to login a user
userRouter.post('/login', userController.loginUser);

// Route to get user email by profileId
// ownerId or sitterId (correspond to user profileId)
userRouter.get('/:profileId/email', userController.getUserEmail);

userRouter
  .route('')
  .post(userController.createUser)
  .get(validateToken, userController.getUser) // user id is in token
  .patch(validateToken, userController.updateUser)
  .delete(validateToken, userController.deleteUser);

export default userRouter;
