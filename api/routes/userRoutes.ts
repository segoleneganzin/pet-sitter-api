import { Router } from 'express';
import * as userController from '../controllers/userController';
import { validateToken } from '../middleware/tokenValidation';

const userRouter = Router();

// Route to login a user
userRouter.post('/login', userController.loginUser);

// Route to register a new user
userRouter.post('/register', userController.createUser);

// Route to get user details (token required)
userRouter.get('/user', validateToken, userController.getUser);

// Route to get user email by id
// (ownerId or sitterId correspond to user profileId)
userRouter.get('/:id/email', userController.getUserEmail);

// Route to update user details (token required)
userRouter.patch('/user', validateToken, userController.updateUser);

// Route to delete a user (token required)
userRouter.delete('/user', validateToken, userController.deleteUser);

export default userRouter;
