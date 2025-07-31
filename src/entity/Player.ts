
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stats } from "./Stats";
import { PlayerTalents } from "./PlayerTalents";
import { Weapon } from "./Weapon";
import { AppDataSource } from "../data-source";
import { Item } from "./Item";
import { PlayerActionModification } from "./PlayerActionModification";

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    discordId: string;

    @OneToOne(() => Stats, stats => stats.player)
    @JoinColumn()
    stats: Stats;

    @OneToMany(() => PlayerTalents, playerTalents => playerTalents.player)
    talents: PlayerTalents[];

    @OneToMany(() => PlayerActionModification, playerActionModification => playerActionModification.player)
    playerActionModifications: PlayerActionModification[];

    @OneToMany(() => Weapon, weapon => weapon.player)
    weapons: Weapon[];

    @OneToMany(() => Item, item => item.player)
    items: Item[];

    @Column({
        type: "enum",
        enum: ["NO", "YES"],
        default: "NO",
        nullable: false
    })
    selected: string;
    
    @Column({nullable: true})
    avatar: string;
}