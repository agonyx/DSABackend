import { Router } from "express";
import playerTalentsController from "../controllers/PlayerTalentsController";

const router = Router();


router.get("/", playerTalentsController.getAll);
router.get("/:id", playerTalentsController.getById);
router.post("/", playerTalentsController.createPlayerTalents);
router.put("/", playerTalentsController.updatePlayerTalents);
router.delete("/:id", playerTalentsController.deletePlayerTalents);


module.exports = router;