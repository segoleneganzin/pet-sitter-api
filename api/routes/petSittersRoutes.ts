import { Router } from 'express';
import * as petSitterController from '../controllers/petSitterController';
import { validateToken } from '../middleware/tokenValidation';

// import { upload, handleError } from '../middleware/uploadMiddleware';

// Création du routeur
const petSitterRouter = Router();

// Global Routes
petSitterRouter.get('/:id/email', petSitterController.getEmail);
petSitterRouter.get('/:id', petSitterController.getPetSitter);
petSitterRouter.get('/', petSitterController.getAllPetSitters);
petSitterRouter.patch('/', validateToken, petSitterController.updatePetSitter);

// router.patch(
//   '/:id/identity',
//   validateToken,
//   upload.single('avatar'),
//   profileIdentityController.updateIdentity,
//   handleError
// );

// router.patch(
//   '/:id/identity/cv',
//   validateToken,
//   upload.single('cv'),
//   profileIdentityController.updateCv,
//   handleError
// );

export default petSitterRouter;
