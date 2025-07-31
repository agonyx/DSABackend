// src/routes/CombatSessionRoutes.ts
import { Router } from "express";
import combatSessionController from "../controllers/CombatSessionController";

const router = Router();

// Create a new session (called by /startcombat)
router.post("/", combatSessionController.create);

// Get session by UUID (useful for bot refreshing state)
router.get("/:id", combatSessionController.getById);

// Get active session for a channel (useful for bot checking context)
router.get("/channel/:channelId/active", combatSessionController.getActiveByChannelId);

// Get any session for a channel (useful for bot checking context)
router.get("/channel/:channelId", combatSessionController.getByChannelId);

// Update session (e.g., set messageId, add log entry)
router.put("/:id", combatSessionController.update);

// Start the combat (set state=RUNNING, turn order, initiative)
router.put("/:id/start", combatSessionController.startCombat);

// End the combat (set state=ENDED)
router.put("/:id/end", combatSessionController.endCombat);

// Delete session (used by /cancelcombat during SETUP)
router.delete("/:id", combatSessionController.delete);

module.exports = router;

// -----------------------------------------
