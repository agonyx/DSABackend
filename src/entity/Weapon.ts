import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Inventory } from "./Inventory";
import { Player } from "./Player";

@Entity()
export class Weapon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: ["MELEE", "RANGED"],
        nullable: false,
    })
    type: string;

    @Column()
    tp: string; 

    @Column()
    at: number;

    @Column()
    pa: number;

    @Column({
        type: "enum",
        enum: ["Y", "N"],
        nullable: false,
    })
    isEquipped: string;

    @Column({
        type: "enum",
        enum: ["ADAPTIVE", "OFFENSE", "DEFENSE"],
        nullable: true,
    })
    equippedSlot: string | null;

    @ManyToOne(() => Player, player => player.weapons,{nullable: false})
    player: Player;
}
