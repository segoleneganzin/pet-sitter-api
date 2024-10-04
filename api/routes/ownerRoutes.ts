import { Router } from 'express';
import * as ownerController from '../controllers/ownerController';

const ownerRouter = Router();

ownerRouter.get('/:id', ownerController.getOwnerById);

ownerRouter.get('/', ownerController.getAllOwners);

export default ownerRouter;
