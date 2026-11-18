import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import {
  Listing,
  ListingStatus,
} from "@/modules/listings/entities/listing.entity";
import { Offer, OfferStatus } from "@/modules/offers/entities/offer.entity";
import { lockListing } from "@/modules/offers/offer-database";
import { Transaction, TransactionStatus } from "./entities/transaction.entity";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  getTransactionsByUserId(userId: string) {
    return this.transactionRepository.find({
      where: [{ buyerId: userId }, { sellerId: userId }],
      order: { createdAt: "DESC", id: "DESC" },
    });
  }

  async getTransactionById(id: string, userId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: [
        { id, buyerId: userId },
        { id, sellerId: userId },
      ],
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }
    return transaction;
  }

  completeTransaction(id: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const { transaction, listing } = await this.getReservedTransaction(
        manager,
        id,
        userId,
      );

      if (transaction.sellerId !== userId) {
        throw new ForbiddenException(
          "Only the seller can complete a transaction",
        );
      }
      if (listing.deleted_at || listing.status !== ListingStatus.RESERVED) {
        throw new ConflictException("Listing is no longer reserved");
      }

      transaction.status = TransactionStatus.COMPLETED;
      transaction.completedAt = new Date();

      await manager.save(transaction);
      await manager.update(Listing, listing.id, { status: ListingStatus.SOLD });
      await manager.update(
        Offer,
        { listingId: listing.id, status: OfferStatus.PENDING },
        { status: OfferStatus.REJECTED },
      );

      return transaction;
    });
  }

  cancelTransaction(id: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const { transaction, listing } = await this.getReservedTransaction(
        manager,
        id,
        userId,
      );

      transaction.status = TransactionStatus.CANCELLED;
      transaction.cancelledAt = new Date();
      await manager.save(transaction);

      if (!listing.deleted_at && listing.status === ListingStatus.RESERVED) {
        await manager.update(Listing, listing.id, {
          status: ListingStatus.ACTIVE,
        });
      }

      return transaction;
    });
  }

  private async getReservedTransaction(
    manager: EntityManager,
    id: string,
    userId: string,
  ) {
    const repository = manager.getRepository(Transaction);
    const where = [
      { id, buyerId: userId },
      { id, sellerId: userId },
    ];
    const existing = await repository.findOne({
      select: { listingId: true },
      where,
    });

    if (!existing) {
      throw new NotFoundException("Transaction not found");
    }

    const listing = await lockListing(manager, existing.listingId);
    const transaction = await repository.findOneBy(where);
    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }
    if (transaction.status !== TransactionStatus.RESERVED) {
      throw new ConflictException("Transaction is no longer reserved");
    }

    return { transaction, listing };
  }
}
