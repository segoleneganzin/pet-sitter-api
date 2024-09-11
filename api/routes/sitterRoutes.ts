import { Router } from 'express';
import * as sitterController from '../controllers/sitterController';
import { validateToken } from '../middleware/tokenValidation';

// import { upload, handleError } from '../middleware/uploadMiddleware';

const sitterRouter = Router();

sitterRouter.get('/:id', sitterController.getSitterById);
sitterRouter.get('/', sitterController.getAllSitters);
sitterRouter.patch('/', validateToken, sitterController.updateSitter);

// router.patch(
//   '/:id/identity',
//   validateToken,
//   upload.single('avatar'),
//   profileIdentityController.updateIdentity,
//   handleError
// );

export default sitterRouter;
