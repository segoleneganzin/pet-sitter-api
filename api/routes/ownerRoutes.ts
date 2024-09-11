import { Router } from 'express';
import * as ownerService from '../services/ownerService';
import { validateToken } from '../middleware/tokenValidation';

// import { upload, handleError } from '../middleware/uploadMiddleware';

const ownerRouter = Router();

// Global Routes
ownerRouter.get('/:id', ownerService.getOwnerById);
ownerRouter.get('/', ownerService.getAllOwners);
ownerRouter.patch('/', validateToken, ownerService.updateOwner);

export default ownerRouter;
