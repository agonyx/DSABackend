import { Request, Response } from "express";
import { playerTalentsRepositoryMethods } from "../repositories/PlayerTalentsRepo";

export class PlayerTalentsController {

    public async getAll(req: Request, res: Response) {
        try {
            const playerTalents = await playerTalentsRepositoryMethods.getAll();
            return res.status(200).send(playerTalents);
        } catch (error) {
            console.error("Failed to fetch player talents:", error);
            return res.status(500).send("An error occurred while fetching player talents.");
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const playerTalents = await playerTalentsRepositoryMethods.getById(parseInt(req.params.id));
            if (!playerTalents) {
                return res.status(404).send("Player talents not found.");
            }
            return res.status(200).send(playerTalents);
        } catch (error) {
            console.error("Failed to fetch player talents:", error);
            return res.status(500).send("An error occurred while fetching player talents.");
        }
    }

    public async createPlayerTalents(req: Request, res: Response) {
        try {
            const playerTalents = await playerTalentsRepositoryMethods.create(req.body);
            const savedPlayerTalents = await playerTalentsRepositoryMethods.createPlayerTalents(playerTalents);
            return res.status(201).send(savedPlayerTalents);
        } catch (error) {
            console.error("Failed to create player talents:", error);
            return res.status(500).send("An error occurred while creating player talents.");
        }
    }

    public async updatePlayerTalents(req: Request, res: Response) {
        try {
            const playerTalents = await playerTalentsRepositoryMethods.create(req.body);
            const savedPlayerTalents = await playerTalentsRepositoryMethods.updatePlayerTalents(playerTalents);
            return res.status(200).send(savedPlayerTalents);
        } catch (error) {
            console.error("Failed to update player talents:", error);
            return res.status(500).send("An error occurred while updating player talents.");
        }
    }

    public async deletePlayerTalents(req: Request, res: Response) {
        try {
            const playerTalents = await playerTalentsRepositoryMethods.deletePlayerTalents(parseInt(req.params.id));
            return res.status(200).send(playerTalents);
        } catch (error) {
            console.error("Failed to delete player talents:", error);
            return res.status(500).send("An error occurred while deleting player talents.");
        }
    }


}
const playerTalentsController = new PlayerTalentsController();
export default playerTalentsController;