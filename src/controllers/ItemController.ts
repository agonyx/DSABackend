import { Item } from "../entity/Item";
import { itemRepositoryMethods } from "../repositories/ItemRepo";
import { Request, Response } from "express";

export class ItemController {

    public async getAll(req: Request, res: Response) {
        try {
            const items = await itemRepositoryMethods.getAll();
            return res.status(200).send(items);
        } catch (error) {
            console.error("Failed to fetch items:", error);
            return res.status(500).send("An error occurred while fetching items.");
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const item = await itemRepositoryMethods.getById(parseInt(req.params.id));
            if (!item) {
                return res.status(404).send("Item not found.");
            }
            return res.status(200).send(item);
        } catch (error) {
            console.error("Failed to fetch item:", error);
            return res.status(500).send("An error occurred while fetching item.");
        }
    }

    public async createItem(req: Request, res: Response) {
        try {
            const item: Item = await itemRepositoryMethods.create(req.body);

            const savedItem = await itemRepositoryMethods.createItem(item);

            return res.status(201).send(savedItem);
        } catch (error) {
            console.error("Failed to create item:", error);
            return res.status(500).send("An error occurred while creating item.");
        }
    }

    public async updateItem(req: Request, res: Response) {
        try {

            const data: Item = await itemRepositoryMethods.create(req.body);

            const item = await itemRepositoryMethods.updateItem(data);
            return res.status(200).send(item);
        } catch (error) {
            console.error("Failed to update item:", error);
            return res.status(500).send("An error occurred while updating item.");
        }
    }

    public async deleteItem(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await itemRepositoryMethods.deleteItem(id);
            return res.status(200).send("Item deleted successfully");
        } catch (error) {
            console.error("Failed to delete item:", error);
            return res.status(500).send("An error occurred while deleting item.");
        }
    }
}
const itemController = new ItemController();
export default itemController;