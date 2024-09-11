import { Router } from 'express';
import * as ownerController from '../controllers/ownerController';
import { validateToken } from '../middleware/tokenValidation';

const ownerRouter = Router();

ownerRouter
  .route('/:id')
  .get(ownerController.getOwnerById)
  .patch(validateToken, ownerController.updateOwner);

ownerRouter.get('/', ownerController.getAllOwners);

export default ownerRouter;
