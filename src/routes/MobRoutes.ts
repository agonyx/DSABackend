// src/routes/MobRoutes.ts
// ... (Router definition remains the same as previous version) ...
import { Router } from "express";
import mobController from "../controllers/MobController";

const router = Router();
router.post("/", mobController.create);
router.get("/", mobController.getAll);
router.get("/id/:id", mobController.getById);
router.get("/name/:name", mobController.getByName);
router.put("/id/:id", mobController.update);
router.delete("/id/:id", mobController.delete);
module.exports = router;