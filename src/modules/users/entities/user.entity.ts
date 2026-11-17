import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/common/enums/role.enum';
import { UserStatus } from '@/common/enums/user-status.enum';
import { Report } from '@/modules/reports/entities/report.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Exclude()
    @Column({name: 'password_hash', select: false})
    passwordHash!: string;

    @Column({ name: 'display_name' })
    displayName!: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role!: Role;

    @Column({type: 'enum', enum: UserStatus, default: UserStatus.PENDING})
    status!: UserStatus;

    @Column({name: 'is_verified', default: false})
    isVerified!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;

    @OneToMany(() => Report, (report) => report.reporter)
    reports!: Report[];

    @OneToMany(() => Report, (report) => report.reported_user)
    received_reports!: Report[];

    @OneToMany(() => Report, (report) => report.reviewer)
    reviewed_reports!: Report[];
}