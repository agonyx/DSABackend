import { AppDataSource } from "../data-source";
import { PlayerTalents } from "../entity/PlayerTalents";

const playerTalentsRepository = AppDataSource.getRepository(PlayerTalents);

export const playerTalentsRepositoryMethods = {
    async getAll() {
        return await playerTalentsRepository.find({
            relations: {
                player: true,
                talent: true
            }
        });
    },
    async getById(id: number) {
        return await playerTalentsRepository.findOne(
            {
                relations: {
                    player: true,
                    talent: true
                },
                where: { id },
            }
        );
    },
    async createMultiplePlayerTalents(playerTalents: PlayerTalents[]) {
        if(playerTalents.length > 0) {
            return await playerTalentsRepository.save(playerTalents);
        }
    },
    async createPlayerTalents(playerTalents: PlayerTalents) {
        return await playerTalentsRepository.save(playerTalents);
    },
    async updatePlayerTalents(playerTalents: PlayerTalents) {
        return await playerTalentsRepository.save(playerTalents);
    },
    async deletePlayerTalents(id: number) {
        return await playerTalentsRepository.delete(id);
    },
    async create(playerTalents: Partial<PlayerTalents>) {
        return playerTalentsRepository.create(playerTalents);
    }
}