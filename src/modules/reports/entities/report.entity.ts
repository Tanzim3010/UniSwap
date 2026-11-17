import{ Column, CreateDateColumn, Entity, PrimaryGeneratedColumn }from"typeorm"
import{User} from "../../users/entities/user.entity";
import{Listing} from "../../listings/entites/listing.entity";
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

    
}