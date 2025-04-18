// src/entity/CombatSession.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Combatant } from './Combatant'; // Adjust path as needed

export enum CombatState {
    SETUP = 'SETUP',
    RUNNING = 'RUNNING',
    ENDED = 'ENDED',
}

@Entity('combat_sessions') // Using snake_case for table name is common
export class CombatSession {
    @PrimaryGeneratedColumn('uuid') // Using UUID is generally good for distributed IDs
    id: string; // This will serve as our sessionId

    @Column({ type: 'varchar', length: 30 }) // Discord IDs are usually strings
    channelId: string;

    @Column({ type: 'varchar', length: 30 })
    dmUserId: string;

    @Column({
        type: 'enum',
        enum: CombatState,
        default: CombatState.SETUP,
    })
    state: CombatState;

    @Column({ type: 'varchar', length: 30, nullable: true }) // Message ID for the main combat display
    messageId: string | null;

    @Column({ type: 'int', default: 0 })
    currentTurnIndex: number;

    // Storing simple arrays like turn order (array of combatant IDs)
    // Using 'simple-array' stores as comma-separated string, good for basic needs.
    // Use 'json' or 'jsonb' (Postgres) if you need complex querying or structured data later.
    @Column({ type: 'simple-array', default: '' })
    turnOrder: string[]; // Array of Combatant IDs (UUIDs)

    // Storing combat log entries
    @Column({ type: 'simple-array', default: '' }) // Or 'jsonb' for more structured logs
    combatLog: string[];

    // Relationship: A session has many combatants
    @OneToMany(() => Combatant, (combatant) => combatant.session, {
        cascade: ['insert', 'update'], // Automatically save/update combatants when session is saved
        eager: true, // Load combatants automatically when loading a session (convenient, but watch performance)
    })
    combatants: Combatant[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
