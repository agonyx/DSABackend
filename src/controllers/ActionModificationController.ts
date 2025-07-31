// src/controllers/ActionModificationController.ts
import { Request, Response } from "express";
import { actionModificationRepoMethods } from "../repositories/ActionModificationRepo";

export class ActionModificationController {
    async getAll(req: Request, res: Response) {
        try {
            const skills = await actionModificationRepoMethods.findAll();
            return res.status(200).json(skills);
        } catch (error: unknown) {
            let message = "An error occurred while fetching action modifications.";
            if (error instanceof Error) message = error.message;
            return res.status(500).send(message);
        }
    }
}

const actionModificationController = new ActionModificationController();
export default actionModificationController;
