import { AppDataSource } from "../data-source";
import { CombatSession, CombatState } from "../entity/CombatSession";
import { FindOneOptions } from "typeorm";


const combatSessionRepository = AppDataSource.getRepository(CombatSession);

export const combatSessionRepositoryMethods = {
    async create(sessionData: Partial<CombatSession>): Promise<CombatSession> {
        return combatSessionRepository.create(sessionData);
    },

    async save(session: CombatSession): Promise<CombatSession> {
        return combatSessionRepository.save(session);
    },

    // Find by primary key (UUID)
    async findById(id: string, relations?: string[]): Promise<CombatSession | null> {
         const options: FindOneOptions<CombatSession> = { where: { id } };
         if (relations) {
             options.relations = relations;
         }
        return combatSessionRepository.findOne(options);
    },

    // Find an active (SETUP or RUNNING) session in a specific channel
    async findActiveByChannelId(channelId: string): Promise<CombatSession | null> {
        return combatSessionRepository.findOne({
            where: [
                { channelId: channelId, state: CombatState.SETUP },
                { channelId: channelId, state: CombatState.RUNNING },
            ],
            relations: ["combatants"], // Usually need combatants when checking active sessions
        });
    },

     // Find all sessions in a specific channel, optionally filtering by state
    async findAllByChannelId(channelId: string, state?: CombatState): Promise<CombatSession[]> {
        const whereClause: any = { channelId };
        if (state) {
            whereClause.state = state;
        }
        return combatSessionRepository.find({
            where: whereClause,
            relations: ["combatants"],
        });
    },

    async delete(id: string): Promise<boolean> {
        // Note: Deleting a session might require cleanup of related Combatants
        // depending on cascade settings or if you want manual control.
        // The onDelete: 'CASCADE' in Combatant should handle this at DB level.
        const result = await combatSessionRepository.delete(id);
        return result.affected !== 0;
    },
};