import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "@/modules/users/entities/user.entity";
import { Category } from "@/modules/categories/entities/category.entity";

export enum ListingCondition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  GOOD = "GOOD",
  FAIR = "FAIR",
}

export enum ListingStatus {
  ACTIVE = "ACTIVE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
}

@Entity("listings")
@Index("idx_listings_category_status", ["category", "status"])
@Index("idx_listings_seller", ["seller"])
export class Listing {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 160 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "double precision", nullable: true })
  price!: number | null;

  @Column({ type: "varchar", length: 20 })
  condition!: ListingCondition;

  @Column({ type: "varchar", length: 20, default: ListingStatus.ACTIVE })
  status!: ListingStatus;

  @Column({
    name: "image_urls",
    type: "text",
    array: true,
    default: () => "'{}'",
  })
  imageUrls!: string[];

  @Column({ type: "varchar", length: 160, nullable: true })
  location!: string | null;

  @ManyToOne(() => Category, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "seller_id" })
  seller!: User;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt!: Date | null;
}
