import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Listing } from "../../listings/entites/listing.entity";
export enum ReportStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    RESOLVED = "resolved",
    REJECTED = "rejected",
}
@Entity("reports")
export class Report {
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @Column({name:"reason", type:"varchar"})
    reason!:string;

    @Column({ name: "description", type: "text", nullable: true })
    description!: string;

    @Column({
        name:"status",
        type:"enum",
        enum:ReportStatus,
        default:ReportStatus.PENDING,
    })
    status!:ReportStatus;

        @Column({ name: "moderation_note", type: "text", nullable: true })
    moderation_note!: string;

    @Column({ name: "reviewed_at", type: "timestamptz", nullable: true })
    reviewed_at!: Date | null;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamptz",
    })
    created_at!: Date;

    @ManyToOne(() => User, (user) => user.reports, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "reporter_id" })
    reporter: User;

  
    @ManyToOne(() => Listing, (listing) => listing.reports, {
        nullable: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "listing_id" })
    listing: Listing;

  
    @ManyToOne(() => User, (user) => user.received_reports, {
        nullable: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "reported_user_id" })
    reported_user: User;

  
    @ManyToOne(() => User, (user) => user.reviewed_reports, {
        nullable: true,
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "reviewed_by" })
    reviewer: User;
}