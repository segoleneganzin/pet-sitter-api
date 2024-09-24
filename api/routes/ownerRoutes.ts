import { Router } from 'express';
import * as ownerController from '../controllers/ownerController';
import { validateToken } from '../middleware/tokenValidation';
import { upload, handleError } from '../middleware/uploadMiddleware';

const ownerRouter = Router();

ownerRouter.get('/user/:userId', ownerController.getOwnerByUserId);

ownerRouter
  .route('/:id')
  .get(ownerController.getOwnerById)
  .patch(
    validateToken,
    upload.single('profilePicture'),
    ownerController.updateOwner,
    handleError
  );

ownerRouter.get('/', ownerController.getAllOwners);

export default ownerRouter;
