import { AppDataSource } from "../data-source";
import { Weapon } from "../entity/Weapon";

const weaponRepository = AppDataSource.getRepository(Weapon);

export const weaponRepositoryMethods = {
    async getAll() {
        return await weaponRepository.find(
            {
                relations: {
                    player: true,
                }, select: {
                    player: {
                        id: true,
                    },
                }
            }
        );
    },
    async getById(id: number) {
        return await weaponRepository.findOne(
            {
                relations: {
                    player: true,
                }, select: {
                    player: {
                        id: true,
                    },
                },
                where: { id },
            }
        );
    },
    async findEquippedWeaponsByPlayer(playerId: number) {
        return await weaponRepository.createQueryBuilder("weapon")
            .leftJoinAndSelect("weapon.player", "player")
            .where("weapon.player.id = :playerId", { playerId })
            .andWhere("weapon.isEquipped = :isEquipped", { isEquipped: "Y" })
            .getMany();
    },
    async createWeapon(weaponData: Partial<Weapon>) {
        if (!weaponData.player || !weaponData.player.id) {
            throw new Error("Player ID is required to create a weapon.");
        }

        const player = await AppDataSource.getRepository("Player").findOneBy({ id: weaponData.player.id });
        if (!player) {
            throw new Error(`Player with ID ${weaponData.player.id} not found.`);
        }

        const weapon = weaponRepository.create({
            ...weaponData,
            player,
        });

        return await weaponRepository.save(weapon);
    },
    async updateWeapon(weapon: Weapon) {
        return await weaponRepository.save(weapon);
    },
    async deleteWeapon(id: number) {
        return await weaponRepository.delete(id);
    },
    async create(weapon: Partial<Weapon>) {
        return weaponRepository.create(weapon);
    }
}