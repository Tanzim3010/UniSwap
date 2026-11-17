import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/common/enums/role.enum';
import { UserStatus } from '@/common/enums/user-status.enum';

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
}