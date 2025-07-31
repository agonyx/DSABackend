// src/routes/PlayerActionModificationRoutes.ts
import { Router } from 'express';
import playerActionModificationController from '../controllers/PlayerActionModificationController';

const router = Router();

router.post('/assign', playerActionModificationController.assignSkill);

module.exports = router;
