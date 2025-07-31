// src/controllers/PlayerActionModificationController.ts
import { Request, Response } from "express";
import { playerActionModificationRepoMethods } from "../repositories/PlayerActionModificationRepo";
import { AppDataSource } from "../data-source";
import { Player } from "../entity/Player";
import { ActionModification } from "../entity/ActionModification";

export class PlayerActionModificationController {
    async assignSkill(req: Request, res: Response) {
        try {
            const { playerId, skillName } = req.body;
            if (!playerId || !skillName) {
                return res.status(400).send("playerId and skillName are required.");
            }

            const playerRepo = AppDataSource.getRepository(Player);
            const skillRepo = AppDataSource.getRepository(ActionModification);

            const player = await playerRepo.findOne({ where: { id: playerId } });
            if (!player) {
                return res.status(404).send("Player not found.");
            }

            const skill = await skillRepo.findOne({ where: { name: skillName } });
            if (!skill) {
                return res.status(404).send("ActionModification (Skill) not found.");
            }

            const newAssignment = await playerActionModificationRepoMethods.assignSkillToPlayer(player, skill);
            return res.status(201).json(newAssignment);

        } catch (error: unknown) {
            let message = "An error occurred while assigning the skill.";
            if (error instanceof Error) message = error.message;
            // Check for duplicate entry error
            if (message.includes("Duplicate entry")) {
                return res.status(409).send("Player already has this skill.");
            }
            return res.status(500).send(message);
        }
    }

    async getSkillsForPlayer(req: Request, res: Response) {
        try {
            const playerId = req.params.playerId;
            if (!playerId) {
                return res.status(400).send("Player ID parameter is required.");
            }

            // Basic validation to ensure playerId is a number
            if (isNaN(Number(playerId))) {
                return res.status(400).send("Invalid Player ID format.");
            }

            const skills = await playerActionModificationRepoMethods.findSkillsForPlayer(playerId);
            
            // Here we could add logic to filter skills based on equipped weapon, etc.
            // For now, we return all learned skills.

            return res.status(200).json(skills);

        } catch (error: unknown) {
            let message = "An error occurred while fetching player skills.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
}

const playerActionModificationController = new PlayerActionModificationController();
export default playerActionModificationController;
