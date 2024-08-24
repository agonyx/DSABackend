import { Router } from "express";
import playerController from "../controllers/PlayerController";

const router = Router();

router.get("/", playerController.getAll);

/*params: id*/
router.get("/:id", playerController.getById);

/*body: name, discordId*/
router.post("/", playerController.createPlayer);

router.put("/:id", playerController.updatePlayer);

router.delete("/:id", playerController.deletePlayerAndRelations);

router.get("/selected/:discordId", playerController.getSelectedPlayer);

module.exports = router;
