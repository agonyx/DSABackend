import { AppDataSource } from "../data-source";
import { Combatant, CombatantType } from "../entity/Combatant";

const combatantRepository = AppDataSource.getRepository(Combatant);

export const combatantRepositoryMethods = {
    async create(combatantData: Partial<Combatant>): Promise<Combatant> {
        return combatantRepository.create(combatantData);
    },

    async save(combatant: Combatant): Promise<Combatant> {
        return combatantRepository.save(combatant);
    },

    async saveMultiple(combatants: Combatant[]): Promise<Combatant[]> {
        return combatantRepository.save(combatants);
    },

    // Find by primary key (UUID)
    async findById(id: string): Promise<Combatant | null> {
        return combatantRepository.findOneBy({ id });
    },

    // Find all combatants belonging to a specific session
    async findBySessionId(sessionId: string): Promise<Combatant[]> {
        return combatantRepository.find({
            where: { sessionId: sessionId },
            // Optional: define default relations to load, e.g., ['playerRef'] if needed often
            // relations: ['playerRef']
        });
    },
    /**
    * Finds an existing PLAYER combatant entry for a specific player in a specific session.
    * @param sessionId The UUID of the combat session
    * @param playerId The numeric ID of the player
    * @returns {Promise<Combatant | null>} The existing combatant or null if not found.
    */
   async findBySessionAndPlayer(sessionId: string, playerId: number): Promise<Combatant | null> {
       return combatantRepository.findOne({
           where: {
               sessionId: sessionId,
               playerId: playerId,
               type: CombatantType.PLAYER // Make sure we only match player types
           }
       });
   },


    async delete(id: string): Promise<boolean> {
        const result = await combatantRepository.delete(id);
        return result.affected !== 0;
    },

    async deleteMultiple(ids: string[]): Promise<boolean> {
         if (ids.length === 0) return true;
         const result = await combatantRepository.delete(ids);
         return result.affected !== 0 && result.affected! >= ids.length; // Ensure all specified were deleted (or as many as existed)
    }
};