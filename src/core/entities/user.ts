import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {LuckyNumber} from "./lucky_number";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column("varchar")
    givenName!: string;

    @Column("varchar")
    fullName!: string;

    @Column("varchar")
    patronymic!: string;

    @OneToMany(() => LuckyNumber, lne => lne.user)
    luckyNumbers!: LuckyNumber[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at',
    })
    createdAt!: Date;
}