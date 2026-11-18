import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Listing } from "@/modules/listings/entities/listing.entity";
import { Offer } from "@/modules/offers/entities/offer.entity";
import { User } from "@/modules/users/entities/user.entity";

export enum TransactionStatus {
  RESERVED = "reserved",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
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

  @ManyToOne(() => Listing, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "listing_id" })
  listing!: Listing;

  @Column({ name: "offer_id", type: "uuid" })
  offerId!: string;

  @OneToOne(() => Offer, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "offer_id" })
  offer!: Offer;

  @Column({ name: "buyer_id", type: "uuid" })
  buyerId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "buyer_id" })
  buyer!: User;

  @Column({ name: "seller_id", type: "uuid" })
  sellerId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "seller_id" })
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
