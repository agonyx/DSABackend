// src/routes/ActionModificationRoutes.ts
import { Router } from "express";
import { ActionModificationController } from "../controllers/ActionModificationController";

const router = Router();
const controller = new ActionModificationController();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));


module.exports = router;
