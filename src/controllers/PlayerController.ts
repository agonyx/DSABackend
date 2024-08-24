import { AppDataSource } from './../data-source';
import { Request, Response } from "express";
import { playerRepositoryMethods } from "../repositories/PlayerRepo";
import { Player } from "../entity/Player";
import { talentsRepositoryMethods } from "../repositories/TalentsRepo";
import { PlayerTalents } from "../entity/PlayerTalents";
import { statsRepositoryMethods } from "../repositories/StatsRepo";
import { Stats } from "../entity/Stats";
import { playerTalentsRepositoryMethods } from "../repositories/PlayerTalentsRepo";
import { Talents } from '../entity/Talents';



export class PlayerController {
    
    public async getAll(req: Request, res: Response) {
        try {
            const players = await playerRepositoryMethods.getAll();
            return res.status(200).send(players);
        } catch (error) {
            console.error("Failed to fetch players:", error);
            return res.status(500).send("An error occurred while fetching players.");
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const player = await playerRepositoryMethods.getById(parseInt(req.params.id));
            if (!player) {
                return res.status(404).send("Player not found.");
            }
            return res.status(200).send(player);
        } catch (error) {
            console.error("Failed to fetch player:", error);
            return res.status(500).send("An error occurred while fetching player.");
        }
    }

    public async getSelectedPlayer(req: Request, res: Response) {
        try {
            const player = await playerRepositoryMethods.getSelectedPlayer(req.params.discordId);
            if (!player) {
                return res.status(404).send("Selected player not found.");
            }
            return res.status(200).send(player);
        } catch (error) {
            console.error("Failed to fetch selected player:", error);
            return res.status(500).send("An error occurred while fetching selected player.");
        }
    }

    /*public async createPlayer(req: Request, res: Response) {
        try {
            const player: Player = await playerRepositoryMethods.create(req.body);
            const savedPlayer = await playerRepositoryMethods.createPlayer(player);
            
            try {
                const newPlayerStats: Stats = new Stats();
                newPlayerStats.player = savedPlayer;
                const savedStats = await statsRepositoryMethods.createStats(newPlayerStats);
    
                const talents = await talentsRepositoryMethods.getAll();
                const defaultFTW = 0;
                const playerTalents = talents.map(talent => {
                    let playerTalent = new PlayerTalents();
                    playerTalent.player = savedPlayer;
                    playerTalent.talent = talent;
                    playerTalent.ftw = defaultFTW;
                    return playerTalent;
                });
                await playerTalentsRepositoryMethods.createMultiplePlayerTalents(playerTalents);
    
                return res.status(201).send({ savedPlayer, savedStats, playerTalents });
            } catch (statsOrTalentsError) {
                console.error("Error creating stats or talents:", statsOrTalentsError);
                return res.status(500).send("Failed to create player stats or talents.");
            }
        } catch (playerCreationError) {
            console.error("There was an error during player creation:", playerCreationError);
            return res.status(500).send("An error occurred while creating player.");
        }
    }*/

    public async createPlayer(req: Request, res: Response) {

        const queryRunner = AppDataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            const player = queryRunner.manager.create(Player, req.body); // This assumes req.body is validated and safe to use
            player.selected = "NO";
            const savedPlayer = await queryRunner.manager.save(player);
    
            const newPlayerStats = new Stats();
            newPlayerStats.player = savedPlayer;
            const savedStats = await queryRunner.manager.save(newPlayerStats);
    
            const talents = await queryRunner.manager.find(Talents); // Assuming Talents is the correct entity name
            const defaultFTW = 0;
            const playerTalents = talents.map(talent => {
                let playerTalent = new PlayerTalents();
                playerTalent.player = savedPlayer;
                playerTalent.talent = talent;
                return playerTalent;
            });
            await queryRunner.manager.save(playerTalents);
    
            await queryRunner.commitTransaction();
    
            return res.status(201).send({ player: savedPlayer, stats: savedStats, talents: playerTalents });
        } catch (error) {
            // Rollback the transaction if an error occurred
            await queryRunner.rollbackTransaction();
            console.error("Failed to create player:", error);
            return res.status(500).send("An error occurred while creating the player.");
        } finally {
            // Release the query runner to free up resources
            await queryRunner.release();
        }
    }

    public async updatePlayer(req: Request, res: Response) {
        try {
            const playerExists = await playerRepositoryMethods.getById(parseInt(req.params.id));
            if (!playerExists) {
                return res.status(404).send("Player not found.");
            }

            const player = await playerRepositoryMethods.create(req.body);

            await playerRepositoryMethods.updatePlayer(player);
            return res.status(200).send("Player updated successfully.");
        } catch (error) {
            console.error("Failed to update player:", error);
            return res.status(500).send("An error occurred while updating the player.");
        }
    }
    
    public async deletePlayerAndRelations(req: Request, res: Response) {
        const playerId = parseInt(req.params.id);
        const queryRunner = AppDataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            const player = await queryRunner.manager.findOne(Player, {
                where: { id: playerId },
                relations: ["stats", "talents", "weapons", "items"]
            });
    
            if (!player) {
                await queryRunner.rollbackTransaction();
                return res.status(404).send("Player not found.");
            }
    
            // Manually remove related entities first
            if (player.weapons) {
                await queryRunner.manager.remove(player.weapons);
            }
            if (player.talents) {
                await queryRunner.manager.remove(player.talents);
            }
            if (player.items) {
                await queryRunner.manager.remove(player.items);
            }

            await queryRunner.manager.remove(player);
            
            if (player.stats) {
                await queryRunner.manager.remove(player.stats);
            }
            await queryRunner.commitTransaction();
            return res.status(200).send("Player and all related data have been deleted successfully.");
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Failed to delete player and related data:", error);
            return res.status(500).send("An error occurred while deleting the player and related data.");
        } finally {
            await queryRunner.release();
        }
    }
    

}
const playerController = new PlayerController();
export default playerController;