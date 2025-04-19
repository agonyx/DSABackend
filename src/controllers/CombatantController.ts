// src/controllers/CombatantController.ts
import { Request, Response } from "express";
import { combatantRepositoryMethods } from "../repositories/CombatantRepo";
import { Combatant, CombatantAllegiance, CombatantType } from "../entity/Combatant";
import { combatSessionRepositoryMethods } from "../repositories/CombatSessionRepo";
import { playerRepositoryMethods } from "../repositories/PlayerRepo"; // Assuming Player repo exists
import { mobRepositoryMethods } from "../repositories/MobRepo"; // Assuming Mob repo exists
import { CombatState } from "../entity/CombatSession";

export class CombatantController {
 /**
     * Adds a new combatant to a session (triggered by Join Button or Add Mob/Hostile)
     * Expects body: {
     * sessionId: string,
     * type: 'PLAYER' | 'NPC',
     * allegiance: 'PLAYER_SIDE' | 'HOSTILE',
     * playerId?: number,      // Required if type is PLAYER
     * mobDefinitionId?: number // Required if type is NPC
     * name: string,
     * maxHP: number,
     * currentHP: number,
     * initiativeBase: number, // Added missing field
     * discordUserId?: string // Required if type is PLAYER (Added missing field)
     * }
     */
 async create(req: Request, res: Response) {
    try {
        const { sessionId, type, allegiance, playerId, mobDefinitionId, name, maxHP, currentHP, initiativeBase, discordUserId } = req.body;

        // --- Validation ---
        if (!sessionId || !type || !allegiance || !name || maxHP === undefined || currentHP === undefined || initiativeBase === undefined) {
             return res.status(400).send("Missing required fields: sessionId, type, allegiance, name, maxHP, currentHP, initiativeBase."); }
         if (!Object.values(CombatantType).includes(type)) { return res.status(400).send("Invalid combatant type."); }
         if (!Object.values(CombatantAllegiance).includes(allegiance)) { return res.status(400).send("Invalid combatant allegiance."); }
         if (type === CombatantType.PLAYER && (!playerId || !discordUserId)) { return res.status(400).send("playerId and discordUserId are required for PLAYER type combatants."); }
         if (type === CombatantType.NPC && !mobDefinitionId) { return res.status(400).send("mobDefinitionId is required for NPC type combatants."); }
        // --- End Validation ---

        // Check session state
        const session = await combatSessionRepositoryMethods.findById(sessionId);
        if (!session) { return res.status(404).send(`Combat session with ID ${sessionId} not found.`); }
        if (session.state !== CombatState.SETUP) { return res.status(400).send("Can only add combatants to sessions in SETUP state."); }

        // ---=== ADJUSTED CHECK: Check for DUPLICATE DISCORD USER ===---
        // If adding a PLAYER, check if this discordUserId already has a character in this session
        if (type === CombatantType.PLAYER && discordUserId) { // Check based on discordUserId
            console.log(`Checking if discord user ${discordUserId} is already in session ${sessionId}`);
            // Use the repository method that finds by discordUserId and sessionId
            const existingCombatant = await combatantRepositoryMethods.findBySessionAndDiscordUser(sessionId, discordUserId);
            if (existingCombatant) {
                // A combatant entry for this user already exists in this session
                console.log(`Discord user ${discordUserId} already has character ${existingCombatant.name} (Combatant ID: ${existingCombatant.id}) in session ${sessionId}. Preventing duplicate join.`);
                // Return 409 Conflict status code
                return res.status(409).send(`You already have a character (${existingCombatant.name}) participating in this combat session.`);
            }
            console.log(`Discord user ${discordUserId} not found in session ${sessionId}. Proceeding to add.`);
        }
        // ---=== END ADJUSTED CHECK ===---

        // Prepare and save the new combatant if check passes
        const combatantData: Partial<Combatant> = {
            sessionId, type, allegiance,
            playerId: type === CombatantType.PLAYER ? playerId : null,
            mobDefinitionId: type === CombatantType.NPC ? mobDefinitionId : null,
            discordUserId: type === CombatantType.PLAYER ? discordUserId : null,
            name, maxHP, currentHP, initiativeBase,
        };
        const combatant = await combatantRepositoryMethods.create(combatantData);
        const savedCombatant = await combatantRepositoryMethods.save(combatant);

        // Return the newly created combatant object
        return res.status(201).json(savedCombatant);

    } catch (error: unknown) {
        console.error("Raw error creating combatant:", error);
        let message = "An error occurred while creating the combatant.";
        if (error instanceof Error) message = error.message;
        // Consider more specific error codes if possible (e.g., foreign key violation)
        return res.status(500).send(message);
    }
}/**
     * Gets a specific combatant within a session based on the Discord User ID.
     * Used by the bot to find which combatant belongs to a user trying to leave.
     * GET /combatant/session/:sessionId/user/:discordId
     */
async getBySessionAndUser(req: Request, res: Response) {
    try {
        const { sessionId, discordId } = req.params;

        if (!sessionId || !discordId) {
            return res.status(400).send("sessionId and discordId parameters are required.");
        }

        console.log(`Controller: Handling getBySessionAndUser for session ${sessionId}, user ${discordId}`);
        const combatant = await combatantRepositoryMethods.findBySessionAndDiscordUser(sessionId, discordId);

        if (!combatant) {
            // It's valid not to find one if the user hasn't joined
            return res.status(404).send("Combatant not found for this user in this session.");
        }

        // Return the found combatant data
        return res.status(200).json(combatant);

    } catch (error: unknown) {
        console.error("Raw error in getBySessionAndUser:", error);
        let message = "An error occurred while fetching the combatant by user and session.";
        if (error instanceof Error) message = error.message;
        return res.status(500).send(message);
    }
}
    /**
     * Gets all combatants for a given session
     */
    async getBySessionId(req: Request, res: Response) {
        try {
            const sessionId = req.params.sessionId;
             if (!sessionId) return res.status(400).send("Session ID parameter is required.");
            const combatants = await combatantRepositoryMethods.findBySessionId(sessionId);
            return res.status(200).json(combatants);
        } catch (error: unknown) {
            console.error("Raw error fetching combatants by Session ID:", error);
            let message = "An error occurred while fetching combatants.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }

    /**
     * Updates a combatant (primarily for HP changes during combat)
     * Expects body e.g., { currentHP: number }
     */
    async update(req: Request, res: Response) {
        try {
            const id = req.params.id; // Combatant UUID
             if (!id) return res.status(400).send("Combatant ID parameter is required.");

            // Only allow updating specific fields, mainly currentHP
            const { currentHP } = req.body;
             if (currentHP === undefined || typeof currentHP !== 'number') {
                 return res.status(400).send("Invalid or missing 'currentHP' in request body.");
             }

            const combatant = await combatantRepositoryMethods.findById(id);
            if (!combatant) {
                return res.status(404).send("Combatant not found.");
            }

            // Check if combat session is running? Maybe allow HP edits anytime?
             const session = await combatSessionRepositoryMethods.findById(combatant.sessionId);
             if (!session || session.state !== CombatState.RUNNING) {
                  return res.status(400).send("Can only update combatant HP during a running combat.");
             }

            // Apply HP change (add checks/clamping)
            combatant.currentHP = Math.max(0, Math.min(combatant.maxHP, currentHP)); // Clamp HP between 0 and maxHP

            // Add other updatable fields here if needed (e.g., status effects)

            const savedCombatant = await combatantRepositoryMethods.save(combatant);

             // Maybe add to session log? Probably better handled by bot after action resolution.
             // session.combatLog.push(`${combatant.name} HP changed to ${combatant.currentHP}`);
             // await combatSessionRepositoryMethods.save(session);

            return res.status(200).json(savedCombatant);

        } catch (error: unknown) {
            console.error("Raw error updating combatant:", error);
            let message = "An error occurred while updating the combatant.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }

    /**
     * Deletes a combatant (triggered by /removecombatant)
     */
    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id; // Combatant UUID
            if (!id) return res.status(400).send("Combatant ID parameter is required.");

            // Optional: Find combatant first to check session state or permissions?
            const combatant = await combatantRepositoryMethods.findById(id);
            if (!combatant) {
                return res.status(404).send("Combatant not found.");
            }
            // Optional: Check if session is RUNNING or SETUP?

            const deleted = await combatantRepositoryMethods.delete(id);
            if (!deleted) {
                 // Should not happen if findById succeeded
                return res.status(404).send("Combatant not found or already deleted.");
            }

             // Add to session log? Probably better handled by bot.
             // const session = await combatSessionRepositoryMethods.findById(combatant.sessionId);
             // if (session) {
             //      session.combatLog.push(`${combatant.name} was removed from combat.`);
             //      await combatSessionRepositoryMethods.save(session);
             // }

            return res.status(204).send(); // Success, no content
        } catch (error: unknown) {
            console.error("Raw error deleting combatant:", error);
            let message = "An error occurred while deleting the combatant.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
}
const combatantController = new CombatantController();
export default combatantController