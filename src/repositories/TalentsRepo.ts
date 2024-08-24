import { AppDataSource } from "../data-source";
import { Talents } from "../entity/Talents";

const talentsRepository = AppDataSource.getRepository(Talents);

export const talentsRepositoryMethods = {
    async getAll() {
        return await talentsRepository.find();
    },
    async getById(id: number) {
        return await talentsRepository.findOne(
            {
                where: { id },
            }
        );
    },
    async createTalents(talents: Talents) {
        return await talentsRepository.save(talents);
    },
    async updateTalents(talents: Talents) {
        return await talentsRepository.save(talents);
    },
    async deleteTalents(id: number) {
        return await talentsRepository.delete(id);
    },
    async create(talents: Partial<Talents>) {
        return talentsRepository.create(talents);
    }
}