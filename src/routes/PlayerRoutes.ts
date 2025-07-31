import { Router } from "express";
import playerController from "../controllers/PlayerController";
import playerActionModificationController from "../controllers/PlayerActionModificationController";
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${req.params.id}-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

router.put('/:id/avatar', upload.single('avatar'), playerController.updatePlayerAvatar);

router.get("/", playerController.getAll);

/*params: id*/
router.get("/:id", playerController.getById);

router.get("/:playerId/action-modifications", playerActionModificationController.getSkillsForPlayer);

router.get("/discord/:discordId", playerController.getAllPlayersByDiscordId);

/*body: name, discordId*/
router.post("/", playerController.createPlayer);

router.put("/:id", playerController.updatePlayer);

router.delete("/:id", playerController.deletePlayerAndRelations);

router.get("/selected/:discordId", playerController.getSelectedPlayer);

//setSelectedPlayer
router.put("/selected/:discordId/:id", playerController.setSelectedPlayer);

module.exports = router;
