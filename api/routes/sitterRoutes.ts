import { Router } from 'express';
import * as sitterController from '../controllers/sitterController';

const sitterRouter = Router();

sitterRouter.get('/:id', sitterController.getSitterById);

sitterRouter.get('', sitterController.getAllSitters);

export default sitterRouter;
