// src/controllers/MobController.ts
// ... (Use the previously corrected version) ...
import { Request, Response } from "express";
import { mobRepositoryMethods } from "../repositories/MobRepo";
import { Mob } from "../entity/Mob";

export class MobController {
    // create, getAll, getById, getByName, update, delete methods as before...
    // (Using the version with 'error: unknown' handling)
     async create(req: Request, res: Response) {
        try {
            const mobData: Partial<Mob> = req.body;
            const mob = await mobRepositoryMethods.create(mobData);
            const savedMob = await mobRepositoryMethods.save(mob);
            return res.status(201).json(savedMob);
        } catch (error: unknown) {
            console.error("Raw error creating mob:", error);
            if (typeof error === 'object' && error !== null && 'code' in error) {
                 const dbError = error as { code?: string | number };
                if (dbError.code === '23505') {
                    return res.status(409).send("A mob with this name already exists.");
                }
            }
            let message = "An error occurred while creating the mob.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const mobs = await mobRepositoryMethods.findAll();
            return res.status(200).json(mobs);
        } catch (error: unknown) {
            console.error("Raw error fetching mobs:", error);
            let message = "An error occurred while fetching mobs.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
     async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).send("Invalid ID format.");
            const mob = await mobRepositoryMethods.findById(id);
            if (!mob) return res.status(404).send("Mob not found.");
            return res.status(200).json(mob);
        } catch (error: unknown) {
            console.error("Raw error fetching mob by ID:", error);
            let message = "An error occurred while fetching the mob.";
             if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
     async getByName(req: Request, res: Response) {
        try {
            const name = req.params.name;
            if (!name) return res.status(400).send("Mob name parameter is required.");
            const mob = await mobRepositoryMethods.findByName(name);
            if (!mob) return res.status(404).send(`Mob with name "${name}" not found.`);
            return res.status(200).json(mob);
        } catch (error: unknown) {
             console.error("Raw error fetching mob by name:", error);
             let message = "An error occurred while fetching the mob.";
             if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
     async update(req: Request, res: Response) {
        try {
             const id = parseInt(req.params.id);
             if (isNaN(id)) return res.status(400).send("Invalid ID format.");
            const mob = await mobRepositoryMethods.findById(id);
            if (!mob) return res.status(404).send("Mob not found.");
            const updatedData: Partial<Mob> = req.body;
            delete updatedData.id;
            Object.assign(mob, updatedData);
            const savedMob = await mobRepositoryMethods.save(mob);
            return res.status(200).json(savedMob);
        } catch (error: unknown) {
            console.error("Raw error updating mob:", error);
             if (typeof error === 'object' && error !== null && 'code' in error) {
                 const dbError = error as { code?: string | number };
                 if (dbError.code === '23505') return res.status(409).send("Cannot update mob: name conflict likely.");
             }
             let message = "An error occurred while updating the mob.";
             if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
     async delete(req: Request, res: Response) {
        try {
             const id = parseInt(req.params.id);
             if (isNaN(id)) return res.status(400).send("Invalid ID format.");
            const deleted = await mobRepositoryMethods.delete(id);
            if (!deleted) return res.status(404).send("Mob not found.");
            return res.status(204).send();
        } catch (error: unknown) {
             console.error("Raw error deleting mob:", error);
             let message = "An error occurred while deleting the mob.";
              if (error instanceof Error) message = error.message;
             if (typeof error === 'object' && error !== null && 'code' in error) {
                 const dbError = error as { code?: string | number };
                 if (dbError.code === '23503') return res.status(409).send("Cannot delete mob: it is referenced elsewhere.");
             }
            return res.status(500).send(message);
        }
    }
}
const mobController = new MobController();
export default mobController;