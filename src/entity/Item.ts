import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('int')
    quantity: number;

    @ManyToOne(() => Player, player => player.items)
    player: Player;
}