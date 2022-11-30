import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Event} from "./event";

@Entity()
export class LuckyNumber extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column("int")
    selected!: number;

    @Column("int")
    eventId!: number;

    @Column("int", {
        nullable: true,
    })
    userId!: number;

    @ManyToOne(() => Event, event => event.luckyNumbers)
    event!: Event;

    @ManyToOne(() => User, user => user.luckyNumbers)
    user!: User;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at',
    })
    createdAt!: Date;
}