import { Router } from "express";
import talentsController from "../controllers/TalentsController";

const router = Router();

router.get("/", talentsController.getAll);
router.get("/:id", talentsController.getById);
router.post("/", talentsController.createTalent);
router.put("/", talentsController.updateTalent);
router.delete("/:id", talentsController.deleteTalent);

module.exports = router;