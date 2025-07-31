// src/entity/PlayerActionModification.ts
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Player } from "./Player";
import { ActionModification } from "./ActionModification";

@Entity()
export class PlayerActionModification {
    @PrimaryColumn()
    playerId: string;

    @PrimaryColumn()
    actionModificationId: string;

    @ManyToOne(() => Player, player => player.playerActionModifications)
    @JoinColumn({ name: "playerId" })
    player: Player;

    @ManyToOne(() => ActionModification, actionModification => actionModification.playerActionModifications)
    @JoinColumn({ name: "actionModificationId" })
    actionModification: ActionModification;
}
