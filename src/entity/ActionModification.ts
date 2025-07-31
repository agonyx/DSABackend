// src/entity/ActionModification.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PlayerActionModification } from "./PlayerActionModification";

export enum ActionType {
    MELEE = "MELEE",
    RANGED = "RANGED",
    MAGIC = "MAGIC"
}

@Entity()
export class ActionModification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @Column("text")
    description: string;

    @Column({
        type: "enum",
        enum: ActionType,
    })
    actionType: ActionType;

    @Column({ type: "simple-json", nullable: true })
    prerequisites: Record<string, any>; // e.g., {"technique": "Swords", "value": 12}

    @Column({ type: "simple-json" })
    rules: Record<string, any>; // e.g., {"type": "power_attack", "at_modifier": -2, "damage_bonus": 2}

    @OneToMany(() => PlayerActionModification, playerActionModification => playerActionModification.actionModification)
    playerActionModifications: PlayerActionModification[];
}
