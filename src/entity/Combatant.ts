// src/entity/Combatant.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CombatSession } from './CombatSession'; // <-- ADJUST PATH if needed
import { Player } from './Player';             // <-- ADJUST PATH if needed
import { Mob } from './Mob';                   // <-- ADJUST PATH if needed

export enum CombatantType {
    PLAYER = 'PLAYER',
    NPC = 'NPC',
}

export enum CombatantAllegiance {
    PLAYER_SIDE = 'PLAYER_SIDE', // Represents players and potentially friendly NPCs
    HOSTILE = 'HOSTILE',         // Represents enemy NPCs / monsters
}

@Entity('combatants') // The name of the database table
export class Combatant {
    @PrimaryGeneratedColumn('uuid')
    id: string; // Unique ID for this combatant instance in this session

    // --- Relationships ---

    @ManyToOne(() => CombatSession, (session) => session.combatants, {
        onDelete: 'CASCADE', // Delete combatant if the session is deleted
        nullable: false      // A combatant must belong to a session
     })
    @JoinColumn({ name: 'sessionId' }) // Defines the foreign key column
    session: CombatSession;

    @Index() // Index foreign key for performance
    @Column({ type: 'uuid' }) // Column to store the FK value directly
    sessionId: string;

    @ManyToOne(() => Player, { // Link to the base Player entity if PLAYER type
        nullable: true,         // NPCs won't have a playerRef
        eager: false            // Don't automatically load the full Player object unless requested
     })
    @JoinColumn({ name: 'playerId' })
    playerRef: Player | null;

    @Index() // Index foreign key for performance
    @Column({ type: 'int', nullable: true }) // Stores the Player's ID (number based on your Player entity)
    playerId: number | null;

    @ManyToOne(() => Mob, { // Link to the Mob definition if NPC type
        nullable: true,      // Players won't have a mobDefinition
        eager: false         // Don't automatically load the full Mob object unless requested
     })
    @JoinColumn({ name: 'mobDefinitionId' })
    mobDefinition: Mob | null;

    @Index() // Index foreign key for performance
    @Column({ type: 'int', nullable: true }) // Stores the Mob's ID
    mobDefinitionId: number | null;

    // --- Basic Info ---

    @Column({ type: 'varchar', length: 100 })
    name: string; // Copied from Player or Mob at creation for easy display

    @Column({ type: 'enum', enum: CombatantType })
    type: CombatantType;

    @Column({ type: 'enum', enum: CombatantAllegiance })
    allegiance: CombatantAllegiance;

    @Column({ type: 'varchar', length: 30, nullable: true }) // <<< Included discordUserId
    discordUserId: string | null; // Populated if type is PLAYER

    // --- Combat State ---

    @Column({ type: 'int', comment: 'Max HP for this combat instance (copied at start)' })
    maxHP: number;

    @Column({ type: 'int', comment: 'Current HP in this combat' })
    currentHP: number;

    @Column({ type: 'int', comment: 'Base Initiative (used for rolling)' }) // <<< Included initiativeBase
    initiativeBase: number;

    @Column({ type: 'int', nullable: true, comment: 'Initiative roll result for this specific combat' })
    initiativeRoll: number | null;

    @Column({ type: 'boolean', default: false, comment: 'Is it currently this combatant\'s turn?' })
    isActiveTurn: boolean;

    // --- Timestamps ---

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // --- Future Extensions ---
    // @Column({ type: 'jsonb', nullable: true, comment: 'Active status effects' })
    // statusEffects: any | null;
}