import { AppDataSource } from "../data-source";
import { Mob } from "../entity/Mob";

const mobRepository = AppDataSource.getRepository(Mob);

export const mobRepositoryMethods = {
    async create(mobData: Partial<Mob>): Promise<Mob> {
        return mobRepository.create(mobData);
    },

    async save(mob: Mob): Promise<Mob> {
        return mobRepository.save(mob);
    },

    async findAll(): Promise<Mob[]> {
        return mobRepository.find();
    },

    async findById(id: number): Promise<Mob | null> {
        return mobRepository.findOneBy({ id });
    },

    async findByName(name: string): Promise<Mob | null> {
        // Consider adding an index to the 'name' column in Mob entity for performance
        return mobRepository.findOneBy({ name });
    },

    async delete(id: number): Promise<boolean> {
        const result = await mobRepository.delete(id);
        return result.affected !== 0; // Return true if a row was deleted
    },
};