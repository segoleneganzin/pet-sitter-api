import { Router } from 'express';
import * as sitterController from '../controllers/sitterController';
import { validateToken } from '../middleware/tokenValidation';

// import { upload, handleError } from '../middleware/uploadMiddleware';

const sitterRouter = Router();

sitterRouter
  .route('/:id')
  .get(sitterController.getSitterById)
  .patch(validateToken, sitterController.updateSitter);

sitterRouter.get('', sitterController.getAllSitters);

// router.patch(
//   '/:id/identity',
//   validateToken,
//   upload.single('avatar'),
//   profileIdentityController.updateIdentity,
//   handleError
// );

export default sitterRouter;
