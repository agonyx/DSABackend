// src/controllers/CombatSessionController.ts
import { Request, Response } from "express";
import { combatSessionRepositoryMethods } from "../repositories/CombatSessionRepo";
import { CombatSession, CombatState } from "../entity/CombatSession";
import { AppDataSource } from "../data-source"; // For transactions if needed later
import { Combatant } from "../entity/Combatant";
import { combatantRepositoryMethods } from "../repositories/CombatantRepo";

export class CombatSessionController {

    /**
     * Creates a new combat session (triggered by /startcombat)
     * Expects: { channelId: string, dmUserId: string } in body
     */
    async create(req: Request, res: Response) {
        try {
            const { channelId, dmUserId } = req.body;
            if (!channelId || !dmUserId) {
                return res.status(400).send("channelId and dmUserId are required.");
            }

            // Check if active combat already exists in this channel
            const existingSession = await combatSessionRepositoryMethods.findActiveByChannelId(channelId);
            if (existingSession) {
                return res.status(409).send(`An active combat session already exists in this channel (ID: ${existingSession.id}).`);
            }

            const sessionData: Partial<CombatSession> = {
                channelId,
                dmUserId,
                state: CombatState.SETUP, // Initial state
                combatants: [], // Start with empty combatants array
                turnOrder: [],
                combatLog: [`Combat setup initiated by DM ${dmUserId}`]
            };
            const session = await combatSessionRepositoryMethods.create(sessionData);
            const savedSession = await combatSessionRepositoryMethods.save(session);
            return res.status(201).json(savedSession); // Return the full session object including ID
        } catch (error: unknown) {
            console.error("Raw error creating combat session:", error);
            let message = "An error occurred while creating the combat session.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }

    /**
     * Gets a specific combat session by ID (useful for bot to refresh state)
     * Loads combatants relation by default here.
     */
    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).send("Session ID parameter is required.");

            const session = await combatSessionRepositoryMethods.findById(id, ['combatants']); // Eager load combatants
            if (!session) {
                return res.status(404).send("Combat session not found.");
            }
            return res.status(200).json(session);
        } catch (error: unknown) {
            console.error("Raw error fetching combat session by ID:", error);
            let message = "An error occurred while fetching the session.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }

    /**
     * Gets the active session for a channel (used by bot commands to check context)
     */
    async getActiveByChannelId(req: Request, res: Response) {
        try {
             const channelId = req.params.channelId;
             if (!channelId) return res.status(400).send("Channel ID parameter is required.");
            const session = await combatSessionRepositoryMethods.findActiveByChannelId(channelId);
            if (!session) {
                return res.status(404).send("No active combat session found for this channel.");
            }
            return res.status(200).json(session); // Includes combatants due to repo method
        } catch (error: unknown) {
            console.error("Raw error fetching active session by Channel ID:", error);
            let message = "An error occurred while fetching the active session.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }

    /**
     * Updates specific fields of a session (e.g., messageId after bot sends message)
     * Expects fields to update in body, e.g., { messageId: string } or { combatLogEntry: string }
     */
    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).send("Session ID parameter is required.");

            const session = await combatSessionRepositoryMethods.findById(id);
            if (!session) {
                return res.status(404).send("Combat session not found.");
            }
             if (session.state === CombatState.ENDED) {
                return res.status(400).send("Cannot update an ended combat session.");
             }

            const { messageId, combatLogEntry } = req.body;

            let updated = false;
            if (messageId !== undefined) {
                session.messageId = messageId;
                updated = true;
            }
             if (combatLogEntry !== undefined && typeof combatLogEntry === 'string') {
                session.combatLog = [...session.combatLog, combatLogEntry]; // Append log entry
                 updated = true;
            }
            // Add other updatable fields as needed (e.g., currentTurnIndex IF handled via direct PUT)

            if (updated) {
                const savedSession = await combatSessionRepositoryMethods.save(session);
                return res.status(200).json(savedSession);
            } else {
                 return res.status(400).send("No updatable fields provided in request body.");
            }

        } catch (error: unknown) {
            console.error("Raw error updating combat session:", error);
            let message = "An error occurred while updating the session.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }

    /**
     * Starts the combat (triggered by Start Fight button)
     * Expects { turnOrder: string[], combatantInitiatives: Array<{ combatantId: string, initiativeRoll: number }> } in body
     */
    async startCombat(req: Request, res: Response) {
        const sessionId = req.params.id;
        if (!sessionId) return res.status(400).send("Session ID parameter is required.");

        const { turnOrder, combatantInitiatives } = req.body;
         if (!Array.isArray(turnOrder) || !Array.isArray(combatantInitiatives)) {
             return res.status(400).send("Missing or invalid turnOrder or combatantInitiatives in request body.");
         }

        // Use a transaction to ensure atomicity
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Lock the session row? Might be overkill initially.
            const session = await queryRunner.manager.findOne(CombatSession, { where: { id: sessionId }});

            if (!session) {
                await queryRunner.rollbackTransaction();
                return res.status(404).send("Combat session not found.");
            }
            if (session.state !== CombatState.SETUP) {
                 await queryRunner.rollbackTransaction();
                 return res.status(400).send("Combat can only be started from SETUP state.");
            }
            if (turnOrder.length < 2) { // Need at least two combatants generally
                 await queryRunner.rollbackTransaction();
                 return res.status(400).send("Cannot start combat with fewer than two participants in turn order.");
            }

            // Update session state
            session.state = CombatState.RUNNING;
            session.turnOrder = turnOrder;
            session.currentTurnIndex = 0; // Start with the first participant
            session.combatLog.push("--- Combat Started! ---");
            const savedSession = await queryRunner.manager.save(session);

             // Update initiative rolls for combatants
             for (const init of combatantInitiatives) {
                 if (init.combatantId && typeof init.initiativeRoll === 'number') {
                     await queryRunner.manager.update(Combatant,
                         { id: init.combatantId, sessionId: sessionId }, // Ensure we only update combatants in *this* session
                         { initiativeRoll: init.initiativeRoll }
                     );
                 } else {
                      console.warn("Skipping invalid initiative data:", init);
                 }
             }

             // Mark first combatant as active (optional, could be handled by bot logic)
             if (turnOrder.length > 0) {
                 const firstCombatantId = turnOrder[0];
                 await queryRunner.manager.update(Combatant, { id: firstCombatantId, sessionId: sessionId }, { isActiveTurn: true });
             }

            await queryRunner.commitTransaction();

            // Fetch the updated session with relations to return full state
            const finalSession = await combatSessionRepositoryMethods.findById(sessionId, ['combatants']);
            return res.status(200).json(finalSession);

        } catch (error: unknown) {
            await queryRunner.rollbackTransaction();
            console.error("Raw error starting combat:", error);
            let message = "An error occurred while starting combat.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        } finally {
             await queryRunner.release();
        }
    }


     /**
      * Ends a combat session (triggered by /endcombat or win/loss condition)
      * Expects optional { reason: string } in body
      */
     async endCombat(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).send("Session ID parameter is required.");

            // Fetch session WITH combatants to update them
            const session = await combatSessionRepositoryMethods.findById(id, ['combatants']);
            if (!session) {
                return res.status(404).send("Combat session not found.");
            }
             if (session.state === CombatState.ENDED) {
                return res.status(400).send("Combat session has already ended.");
             }

            const { reason } = req.body;

            session.state = CombatState.ENDED;
            // session.isActiveTurn = false; // *** FIX: Removed this line ***

            if (reason) {
                session.combatLog.push(`--- Combat Ended: ${reason} ---`);
            } else {
                 session.combatLog.push("--- Combat Ended ---");
            }

            // Update combatants in the array before saving the session
            // Note: This relies on the session save potentially cascading updates
            // if cascade is set on the relation. A safer way is to explicitly save combatants.
            let combatantsToSave: Combatant[] = [];
            if (session.combatants && session.combatants.length > 0) {
               session.combatants.forEach(c => {
                    if (c.isActiveTurn) { // Only update if needed
                       c.isActiveTurn = false;
                       combatantsToSave.push(c);
                    }
                });
            }
            // Explicitly save changed combatants if cascade isn't guaranteed/used for this
            if (combatantsToSave.length > 0) {
               await combatantRepositoryMethods.saveMultiple(combatantsToSave);
            }


            // Save the session itself
            const savedSession = await combatSessionRepositoryMethods.save(session);
            // Reload the session to get the updated combatants after save if needed
            const finalSession = await combatSessionRepositoryMethods.findById(id, ['combatants']);

            return res.status(200).json(finalSession);

        } catch (error: unknown) {
            console.error("Raw error ending combat session:", error);
            let message = "An error occurred while ending the session.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }

    /**
     * Deletes a combat session (used by /cancelcombat during setup)
     */
    async delete(req: Request, res: Response) {
        try {
             const id = req.params.id;
             if (!id) return res.status(400).send("Session ID parameter is required.");

             // Optional: Add check to only allow deleting sessions in SETUP state?
             const session = await combatSessionRepositoryMethods.findById(id);
             if (!session) {
                 return res.status(404).send("Combat session not found.");
             }
            // if (session.state !== CombatState.SETUP) {
            //     return res.status(400).send("Can only delete sessions that are in SETUP state.");
            // }

             // onDelete: 'CASCADE' on Combatant's relation should handle deleting combatants
            const deleted = await combatSessionRepositoryMethods.delete(id);
            if (!deleted) {
                // Should not happen if findById succeeded, but good practice
                return res.status(404).send("Combat session not found or already deleted.");
            }
            return res.status(204).send(); // Success, no content
        } catch (error: unknown) {
            console.error("Raw error deleting combat session:", error);
            let message = "An error occurred while deleting the session.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
}
const combatSessionController = new CombatSessionController();
export default combatSessionController;