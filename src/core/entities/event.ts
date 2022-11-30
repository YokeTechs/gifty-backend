import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {LuckyNumber} from "./lucky_number";

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column("int")
    start!: number;

    @Column("int")
    end!: number;

    @Column("boolean")
    active!: boolean;

    @OneToMany(() => LuckyNumber, lne => lne.event)
    luckyNumbers!: LuckyNumber[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at',
    })
    createdAt!: Date;
}