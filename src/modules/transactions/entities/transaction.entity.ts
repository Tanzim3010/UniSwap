import {
    Column,
    Check,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Offer } from "@/modules/offers/entities/offer.entity";
import { User } from "@/modules/users/entities/user.entity";

export enum TransactionStatus {
    RESERVED = "reserved",
}

@Entity("transactions")
@Index("uq_transactions_one_reserved_per_listing", ["listingId"], {
    unique: true,
    where: `"status" = 'reserved'`,
})
@Check("ck_transactions_buyer_not_seller", `"buyer_id" <> "seller_id"`)
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "listing_id", type: "uuid" })
    listingId!: string;

    @Column({ name: "offer_id", type: "uuid" })
    offerId!: string;

    @OneToOne(() => Offer, { nullable: false, onDelete: "RESTRICT" })
    @JoinColumn({ name: "offer_id", referencedColumnName: "id" })
    offer!: Offer;

    @Column({ name: "buyer_id", type: "uuid" })
    buyerId!: string;

    @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
    @JoinColumn({ name: "buyer_id", referencedColumnName: "id" })
    buyer!: User;

    @Column({ name: "seller_id", type: "uuid" })
    sellerId!: string;

    @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
    @JoinColumn({ name: "seller_id", referencedColumnName: "id" })
    seller!: User;
    @Column({
        type: "enum",
        enum: TransactionStatus,
        enumName: "transaction_status",
        default: TransactionStatus.RESERVED,
    })
    status!: TransactionStatus;

    @Column({ name: "completed_at", type: "timestamptz", nullable: true })
    completedAt!: Date | null;

    @Column({ name: "cancelled_at", type: "timestamptz", nullable: true })
    cancelledAt!: Date | null;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt!: Date;
}