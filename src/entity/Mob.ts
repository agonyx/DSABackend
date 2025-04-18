// src/entity/Mob.ts (New Entity)
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('mobs') // Or NPCDefinitions
export class Mob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true }) // Unique name for easy lookup
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    // Base stats for this type of mob
    @Column({ type: 'int' })
    baseMaxHP: number;

    @Column({ type: 'int' })
    baseInitiative: number;

    @Column({ type: 'int' })
    baseAttackValue: number;

    @Column({ type: 'int' })
    baseParryValue: number;

    @Column({ type: 'int' })
    baseArmorSoak: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    baseDamageTP: string | null;

    // Could add fields for special abilities, loot, etc. later
    // @Column({ type: 'jsonb', nullable: true })
    // specialAbilities: any | null;

    // Optional: Track who created it
    // @Column({ type: 'varchar', length: 30, nullable: true })
    // createdByUserId: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

// -----------------------------------------
