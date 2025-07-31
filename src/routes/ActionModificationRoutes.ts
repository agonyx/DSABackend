// src/routes/ActionModificationRoutes.ts
import { Router } from 'express';
import actionModificationController from '../controllers/ActionModificationController';

const router = Router();

router.get('/', actionModificationController.getAll);

module.exports = router;
