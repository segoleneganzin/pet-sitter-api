import { Router } from 'express';
import * as ownerController from '../controllers/ownerController';
import { validateToken } from '../middleware/tokenValidation';

const ownerRouter = Router();

ownerRouter.get('/:id', ownerController.getOwnerById);
ownerRouter.get('/', ownerController.getAllOwners);
ownerRouter.patch('/', validateToken, ownerController.updateOwner);

export default ownerRouter;
