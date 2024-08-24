import { Router } from "express";
import weaponController from "../controllers/WeaponController";

const router = Router();

router.get("/", weaponController.getAll);
router.get("/:id", weaponController.getById);
router.post("/", weaponController.createWeapon);
router.put("/", weaponController.updateWeapon);

router.post("/equip/:id", weaponController.equipWeapon);
router.post("/unequip/:id", weaponController.unequipWeapon);
router.get("/equipped/:playerId", weaponController.getEquippedWeapon);

router.delete("/:id", weaponController.deleteWeapon);

module.exports = router;