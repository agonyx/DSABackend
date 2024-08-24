import { talentsRepositoryMethods } from "../repositories/TalentsRepo";
import { Request, Response } from "express";

export class TalentsController {

    public async getAll(req: Request, res: Response) {
        try {
            const talents = await talentsRepositoryMethods.getAll();
            return res.status(200).send(talents);
        } catch (error) {
            console.error("Failed to fetch talents:", error);
            return res.status(500).send("An error occurred while fetching talents.");
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const talent = await talentsRepositoryMethods.getById(parseInt(req.params.id));
            if (!talent) {
                return res.status(404).send("Talent not found.");
            }
            return res.status(200).send(talent);
        } catch (error) {
            console.error("Failed to fetch talent:", error);
            return res.status(500).send("An error occurred while fetching talent.");
        }
    }

    public async createTalent(req: Request, res: Response) {
        try {
            const talent = await talentsRepositoryMethods.create(req.body);
            const savedTalent = await talentsRepositoryMethods.createTalents(talent);
            return res.status(201).send(savedTalent);
        } catch (error) {
            console.error("Failed to create talent:", error);
            return res.status(500).send("An error occurred while creating talent.");
        }
    }

    public async updateTalent(req: Request, res: Response) {
        try {
            const talent = await talentsRepositoryMethods.create(req.body);
            const savedTalent = await talentsRepositoryMethods.updateTalents(talent);
            return res.status(200).send(savedTalent);
        } catch (error) {
            console.error("Failed to update talent:", error);
            return res.status(500).send("An error occurred while updating talent.");
        }
    }

    public async deleteTalent(req: Request, res: Response) {
        try {
            const talent = await talentsRepositoryMethods.deleteTalents(parseInt(req.params.id));
            return res.status(200).send(talent);
        } catch (error) {
            console.error("Failed to delete talent:", error);
            return res.status(500).send("An error occurred while deleting talent.");
        }
    }
}

const talentsController = new TalentsController();
export default talentsController;