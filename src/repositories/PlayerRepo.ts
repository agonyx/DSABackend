import { AppDataSource } from "../data-source";
import { Player } from "../entity/Player";

const playerRepository = AppDataSource.getRepository(Player);

export const playerRepositoryMethods = {
    async getAll() {
        return await playerRepository.find({
            relations: ["stats", "talents", "weapons", "items"],
        });
    },
    async getById(id: number) {
        return await playerRepository.findOne(
            {
                relations: ["stats", "talents", "weapons","items"],
                where: { id },
            }
        );
    },
    async getSelectedPlayer(discordId: string) {
        return await playerRepository.findOne(
            {
                relations: ["stats", "talents", "weapons","items"],
                where: { discordId, selected: "YES" },
            }
        );
    },
    async getAllPlayersByDiscordId(discordId: string) {
        return await playerRepository.find({
            relations: ["stats", "talents", "weapons","items"],
            where: { discordId: discordId },
        });
    },
    async createPlayer(player: Player) {
        return await playerRepository.save(player);
    },
    async updatePlayer(player: Player) {
        return await playerRepository.save(player);
    },
    async deletePlayer(id: number) {
        return await playerRepository.delete(id);
    },
    async create(player: Partial<Player>) {
        return playerRepository.create(player);
    }
}