import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm";
import { Player } from "./Player";
import { Talents } from "./Talents";

@Entity()
export class PlayerTalents {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Player, player => player.talents)
    player: Player;

    @ManyToOne(() => Talents)
    talent: Talents;

    @Column({ type: "int", default: 0 })
    ftw: number;
}
