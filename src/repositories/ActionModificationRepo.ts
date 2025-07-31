// src/repositories/ActionModificationRepo.ts
import { AppDataSource } from "../data-source";
import { ActionModification } from "../entity/ActionModification";

const actionModificationRepository = AppDataSource.getRepository(ActionModification);

export const actionModificationRepoMethods = {
    async findByName(name: string): Promise<ActionModification | null> {
        return actionModificationRepository.findOne({ where: { name } });
    },

    async findAll(): Promise<ActionModification[]> {
        return actionModificationRepository.find();
    },
};
