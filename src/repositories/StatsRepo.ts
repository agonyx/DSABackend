import { Stats } from "../entity/Stats";
import { AppDataSource } from "../data-source";

const statsRepository = AppDataSource.getRepository(Stats);

export const statsRepositoryMethods = {
    async getAll() {
        return await statsRepository.find();
    },
    async getById(id: number) {
        return await statsRepository.findOne(
            {
                where: { id },
            }
        );
    },
    async save(stats: Stats) {
        return await statsRepository.save(stats);
    },

    async deleteStats(id: number) {
        return await statsRepository.delete(id);
    },

    async create(stats: Partial<Stats>) {
        return statsRepository.create(stats);
    }
}