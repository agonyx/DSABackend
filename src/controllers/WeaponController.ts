import { Request, Response } from "express";
import { weaponRepositoryMethods } from "../repositories/WeaponRepo";
export class WeaponController {
    constructor() {
        // Bind the methods to ensure `this` context is preserved
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.createWeapon = this.createWeapon.bind(this);
        this.checkIfPlayerHasEquippedWeapons = this.checkIfPlayerHasEquippedWeapons.bind(this);
        this.equipWeapon = this.equipWeapon.bind(this);
        this.unequipWeapon = this.unequipWeapon.bind(this);
        this.getEquippedWeapon = this.getEquippedWeapon.bind(this);
        this.updateWeapon = this.updateWeapon.bind(this);
        this.deleteWeapon = this.deleteWeapon.bind(this);
    }
    public async getAll(req: Request, res: Response) {
        try {
            const weapons = await weaponRepositoryMethods.getAll();
            return res.status(200).send(weapons);
        } catch (error) {
            console.error("Failed to fetch weapons:", error);
            return res.status(500).send("An error occurred while fetching weapons.");
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const weapon = await weaponRepositoryMethods.getById(parseInt(req.params.id));
            if (!weapon) {
                return res.status(404).send("Weapon not found.");
            }
            return res.status(200).send(weapon);
        } catch (error) {
            console.error("Failed to fetch weapon:", error);
            return res.status(500).send("An error occurred while fetching weapon.");
        }
    }

    public async createWeapon(req: Request, res: Response) {
        try {
            const savedWeapon = await weaponRepositoryMethods.createWeapon(req.body);
            return res.status(201).send(savedWeapon);
        } catch (error) {
            console.error("Failed to create weapon:", error);
            if (error instanceof Error) {
                return res.status(400).send(error.message);
            }
            return res.status(500).send("An error occurred while creating weapon.");
        }
    }

    public async checkIfPlayerHasEquippedWeapons(playerId: number) {
        try {
            const equippedWeapons = await weaponRepositoryMethods.findEquippedWeaponsByPlayer(playerId);
            return equippedWeapons;
        } catch (error) {
            console.error("Failed to fetch equipped weapons:", error);
            throw new Error("An error occurred while fetching equipped weapons.");
        }
    }

    public async equipWeapon(req: Request, res: Response) {
        try {
            const weaponId = parseInt(req.params.id);
            const weapon = await weaponRepositoryMethods.getById(weaponId);
            if (!weapon) {
                return res.status(404).send("Weapon not found.");
            }
    
            const equippedSlot = req.body.equippedSlot;
            const equippedWeapons = await this.checkIfPlayerHasEquippedWeapons(weapon.player.id);
    
            if (equippedWeapons && equippedWeapons.length > 0) {
                for (const equippedWeapon of equippedWeapons) {
                    if (equippedSlot === "ADAPTIVE" || equippedWeapon.equippedSlot === equippedSlot) {
                        equippedWeapon.isEquipped = "N";
                        equippedWeapon.equippedSlot = null;
                        await weaponRepositoryMethods.updateWeapon(equippedWeapon);
                    } else if (equippedWeapon.equippedSlot === "ADAPTIVE") {
                        if (equippedSlot === "OFFENSE") {
                            equippedWeapon.equippedSlot = "DEFENSE";
                        } else if (equippedSlot === "DEFENSE") {
                            equippedWeapon.equippedSlot = "OFFENSE";
                        }
                        await weaponRepositoryMethods.updateWeapon(equippedWeapon);
                    }
                }
            }
    
            weapon.equippedSlot = equippedSlot;
            weapon.isEquipped = "Y";
            const savedWeapon = await weaponRepositoryMethods.updateWeapon(weapon);
            return res.status(200).send(savedWeapon.name + " successfully equipped as " + equippedSlot + " weapon.");
        } catch (error) {
            console.error("Failed to equip weapon:", error);
            return res.status(500).send("An error occurred while equipping weapon.");
        }
    }
    

    public async unequipWeapon(req: Request, res: Response) {
        try {
            const weaponId = parseInt(req.params.id);
            const weapon = await weaponRepositoryMethods.getById(weaponId);
    
            if (!weapon) {
                return res.status(404).send("Weapon not found.");
            }
    
            if (weapon.isEquipped !== "Y") {
                return res.status(400).send("Weapon is not currently equipped.");
            }
    
            weapon.isEquipped = "N";
            weapon.equippedSlot = null;
    
            const savedWeapon = await weaponRepositoryMethods.updateWeapon(weapon);
            return res.status(200).send("Weapon unequipped successfully.");
        } catch (error) {
            console.error("Failed to unequip weapon:", error);
            return res.status(500).send("An error occurred while unequipping weapon.");
        }
    }
    

    public async getEquippedWeapon(req: Request, res: Response) {
        try {
            const playerId = parseInt(req.params.playerId);

            const equippedWeapons = await weaponRepositoryMethods.findEquippedWeaponsByPlayer(playerId);

            if (!equippedWeapons || equippedWeapons.length === 0) {
                return res.status(404).send("No equipped weapons found for this player.");
            }

            return res.status(200).json(equippedWeapons);
        } catch (error) {
            console.error("Failed to get equipped weapons:", error);
            return res.status(500).send("An error occurred while fetching equipped weapons.");
        }
    }

    public async updateWeapon(req: Request, res: Response) {
        try {

            const data = await weaponRepositoryMethods.create(req.body);

            const weapon = await weaponRepositoryMethods.updateWeapon(data);
            return res.status(200).send(weapon);
        } catch (error) {
            console.error("Failed to update weapon:", error);
            return res.status(500).send("An error occurred while updating weapon.");
        }
    }

    public async deleteWeapon(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await weaponRepositoryMethods.deleteWeapon(id);
            return res.status(200).send("Weapon deleted successfully");
        } catch (error) {
            console.error("Failed to delete weapon:", error);
            return res.status(500).send("An error occurred while deleting weapon.");
        }
    }

}
const weaponController = new WeaponController();
export default weaponController;