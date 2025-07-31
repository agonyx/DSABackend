import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";

@Entity()
export class Stats {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Player, player => player.stats)
    player: Player;

    @Column({ type: "int", default: 0 })
    mu: number;

    @Column({ type: "int", default: 0 })
    kl: number;

    @Column({ type: "int", default: 0 })
    in: number;

    @Column({ type: "int", default: 0 })
    ch: number;

    @Column({ type: "int", default: 0 })
    ff: number;

    @Column({ type: "int", default: 0 })
    ge: number;

    @Column({ type: "int", default: 0 })
    ko: number;

    @Column({ type: "int", default: 0 })
    kk: number;

    @Column({ type: "int", default: 0 })
    le_max: number;

    @Column({ type: "int", default: 0 })
    le_current: number;

    @Column({ type: "int", default: 0 })
    initiative: number;

    @Column({ type: "int", default: 0 })
    ruestungsschutz: number;

    @Column({ type: "int", default: 0 })
    ausweichen: number;
}