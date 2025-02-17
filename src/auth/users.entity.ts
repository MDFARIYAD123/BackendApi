import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: false })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    googleId: string;

    @Column({ nullable: true })
    microsoftId: string;
}
