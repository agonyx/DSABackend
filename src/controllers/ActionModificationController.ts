// src/controllers/ActionModificationController.ts
import { Request, Response } from "express";
import { actionModificationRepoMethods as actionModificationRepo } from "../repositories/ActionModificationRepo";

export class ActionModificationController {

    async getAll(req: Request, res: Response) {
        try {
            const modifications = await actionModificationRepo.findAll();
            res.json(modifications);
        } catch (error) {
            res.status(500).json({ message: "Error fetching action modifications", error });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const modification = await actionModificationRepo.findById(id);
            if (modification) {
                res.json(modification);
            } else {
                res.status(404).json({ message: "Action modification not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching action modification", error });
        }
    }
}


const actionModificationController = new ActionModificationController();
export default actionModificationController;
