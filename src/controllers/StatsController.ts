import { statsRepositoryMethods } from "../repositories/StatsRepo";
import { Request, Response } from "express";

export class StatsController {

    public async getAll(req: Request, res: Response) {
        try {
            const stats = await statsRepositoryMethods.getAll();
            return res.status(200).send(stats);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            return res.status(500).send("An error occurred while fetching stats.");
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const stats = await statsRepositoryMethods.getById(parseInt(req.params.id));
            if (!stats) {
                return res.status(404).send("Stats not found.");
            }
            return res.status(200).send(stats);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            return res.status(500).send("An error occurred while fetching stats.");
        }
    }

    public async createStats(req: Request, res: Response) {
        try {
            const stats = await statsRepositoryMethods.create(req.body);
            const savedStats = await statsRepositoryMethods.createStats(stats);
            return res.status(201).send(savedStats);
        } catch (error) {
            console.error("Failed to create stats:", error);
            return res.status(500).send("An error occurred while creating stats.");
        }
    }

    public async updateStats(req: Request, res: Response) {
        try {
            const stats = await statsRepositoryMethods.create(req.body);
            const savedStats = await statsRepositoryMethods.updateStats(stats);
            return res.status(200).send(savedStats);
        } catch (error) {
            console.error("Failed to update stats:", error);
            return res.status(500).send("An error occurred while updating stats.");
        }
    }

    public async deleteStats(req: Request, res: Response) {
        try {
            const stats = await statsRepositoryMethods.deleteStats(parseInt(req.params.id));
            return res.status(200).send(stats);
        } catch (error) {
            console.error("Failed to delete stats:", error);
            return res.status(500).send("An error occurred while deleting stats.");
        }
    }
}
const statsController = new StatsController();
export default statsController;