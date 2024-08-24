import { Router } from "express";
import itemController from "../controllers/ItemController";

const router = Router();

router.get("/", itemController.getAll);
router.get("/:id", itemController.getById);
router.post("/", itemController.createItem);
router.put("/", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;