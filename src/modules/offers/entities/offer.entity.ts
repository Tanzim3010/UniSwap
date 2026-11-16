import {
    Column,
    Index,
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "@/modules/users/entities/user.entity";

export enum OfferStatus {
    PENDING = "pending",
}

@Entity("offers")
@Index("uq_offers_one_pending_per_buyer_listing", ["listingId", "buyerId"], {
    unique: true,
    where: `"status" = 'pending'`,
})
export class Offer {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "listing_id", type: "uuid" })
    listingId!: string;

    @Column({ name: "buyer_id", type: "uuid" })
    buyerId!: string;

    @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
    @JoinColumn({ name: "buyer_id", referencedColumnName: "id" })
    buyer!: User;

    @Column({
        name: "offered_price",
        type: "numeric",
        precision: 10,
        scale: 2,
        nullable: true,
    })
    offeredPrice!: string | null;

    @Column({ type: "text", nullable: true })
    message!: string | null;

    @Column({
        type: "enum",
        enum: OfferStatus,
        enumName: "offer_status",
        default: OfferStatus.PENDING,
    })
    status!: OfferStatus;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt!: Date;
}