// src/repositories/PlayerActionModificationRepo.ts
import { AppDataSource } from "../data-source";
import { PlayerActionModification } from "../entity/PlayerActionModification";
import { Player } from "../entity/Player";
import { ActionModification } from "../entity/ActionModification";

const playerActionModificationRepository = AppDataSource.getRepository(PlayerActionModification);

export const playerActionModificationRepoMethods = {
    async assignSkillToPlayer(player: Player, skill: ActionModification): Promise<PlayerActionModification> {
        const newAssignment = playerActionModificationRepository.create({
            player: player,
            actionModification: skill,
        });
        return playerActionModificationRepository.save(newAssignment);
    },

    async findSkillsForPlayer(playerId: string): Promise<ActionModification[]> {
        const assignments = await playerActionModificationRepository.find({
            where: { playerId: playerId },
            relations: ["actionModification"],
        });
        return assignments.map(assignment => assignment.actionModification);
    },

    async unassignSkillFromPlayer(playerId: string, skillId: string): Promise<boolean> {
        const result = await playerActionModificationRepository.delete({
            playerId: playerId,
            actionModificationId: skillId,
        });
        return result.affected !== 0;
    }
};
