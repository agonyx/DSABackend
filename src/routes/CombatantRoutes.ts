
// src/routes/CombatantRoutes.ts
import { Router } from "express";
import combatantController from "../controllers/CombatantController";

const router = Router();

// Add a combatant to a session (called by join, addmob, addhostile)
router.post("/", combatantController.create);

// Get all combatants for a session UUID
router.get("/session/:sessionId", combatantController.getBySessionId);

// Update a combatant by its UUID (e.g., currentHP)
router.put("/:id", combatantController.update);

// Delete a combatant by its UUID (called by /removecombatant)
router.delete("/:id", combatantController.delete);
router.get("/session/:sessionId/user/:discordId", combatantController.getBySessionAndUser);
module.exports = router;