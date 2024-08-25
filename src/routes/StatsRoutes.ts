import { Router } from "express";
import statsController from "../controllers/StatsController";

const router = Router();

router.get("/", statsController.getAll);
router.get("/:id", statsController.getById);
router.post("/", statsController.createStats);
router.put("/:id", statsController.updateStats);
router.delete("/:id", statsController.deleteStats);


module.exports = router;