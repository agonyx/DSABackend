import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";
import { Weapon } from "./Weapon";

//To be implemented

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;
}

