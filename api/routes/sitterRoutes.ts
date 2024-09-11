import { Router } from 'express';
import * as sitterController from '../controllers/sitterController';
import { validateToken } from '../middleware/tokenValidation';
import { upload, handleError } from '../middleware/uploadMiddleware';

const sitterRouter = Router();

sitterRouter
  .route('/:id')
  .get(sitterController.getSitterById)
  // .patch(validateToken, sitterController.updateSitter);
  .patch(
    validateToken,
    upload.single('profilePicture'),
    sitterController.updateSitter,
    handleError
  );

sitterRouter.get('', sitterController.getAllSitters);

export default sitterRouter;
