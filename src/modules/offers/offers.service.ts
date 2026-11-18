import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import { Category } from "@/modules/categories/entities/category.entity";
import {
  Listing,
  ListingStatus,
} from "@/modules/listings/entities/listing.entity";
import {
  Transaction,
  TransactionStatus,
} from "@/modules/transactions/entities/transaction.entity";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Offer, OfferStatus } from "./entities/offer.entity";
import { isUniqueViolation, lockListing } from "./offer-database";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
  ) {}

  getOffersByBuyerId(buyerId: string) {
    return this.offerRepository.find({
      where: { buyerId },
      order: { createdAt: "DESC", id: "DESC" },
    });
  }

  async getOffersForListing(listingId: string, sellerId: string) {
    const listing = await this.dataSource.getRepository(Listing).findOne({
      where: { id: listingId },
      select: { id: true, seller: { id: true } },
      relations: { seller: true },
    });

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }
    if (listing.seller.id !== sellerId) {
      throw new ForbiddenException(
        "Only the listing owner can view its offers",
      );
    }

    return this.offerRepository.find({
      where: { listingId },
      order: { createdAt: "DESC", id: "DESC" },
    });
  }

  async createOffer(buyerId: string, dto: CreateOfferDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const listing = await lockListing(manager, dto.listingId);
        if (listing.deleted_at) {
          throw new NotFoundException("Listing not found");
        }
        if (listing.seller_id === buyerId) {
          throw new ForbiddenException("You cannot bid on your own listing");
        }

        await this.assertListingAvailable(manager, listing);

        const repository = manager.getRepository(Offer);
        const offer = repository.create({
          listingId: listing.id,
          buyerId,
          offeredPrice: dto.offeredPrice?.toFixed(2) ?? null,
          message: dto.message ?? null,
          status: OfferStatus.PENDING,
        });

        return repository.save(offer);
      });
    } catch (error) {
      if (isUniqueViolation(error, "uq_offers_one_pending_per_buyer_listing")) {
        throw new ConflictException(
          "You already have a pending offer for this listing",
        );
      }
      throw error;
    }
  }

  async rejectOffer(id: string, sellerId: string) {
    return this.dataSource.transaction(async (manager) => {
      const { offer } = await this.getPendingOfferForSeller(
        manager,
        id,
        sellerId,
      );
      offer.status = OfferStatus.REJECTED;
      return manager.save(offer);
    });
  }

  async acceptOffer(id: string, sellerId: string) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { offer, listing } = await this.getPendingOfferForSeller(
          manager,
          id,
          sellerId,
        );
        await this.assertListingAvailable(manager, listing);

        const transaction = manager.create(Transaction, {
          listingId: listing.id,
          offerId: offer.id,
          buyerId: offer.buyerId,
          sellerId,
          status: TransactionStatus.RESERVED,
        });

        await manager.save(transaction);
        offer.status = OfferStatus.ACCEPTED;
        await manager.save(offer);
        await manager.update(Listing, listing.id, {
          status: ListingStatus.RESERVED,
        });

        return { offer, transaction };
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          "This offer or listing already has a transaction",
        );
      }
      throw error;
    }
  }

  private async getPendingOfferForSeller(
    manager: EntityManager,
    id: string,
    sellerId: string,
  ) {
    const repository = manager.getRepository(Offer);
    const existing = await repository.findOne({
      select: { listingId: true },
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Offer not found");
    }

    const listing = await lockListing(manager, existing.listingId);
    if (listing.deleted_at) {
      throw new NotFoundException("Listing not found");
    }
    if (listing.seller_id !== sellerId) {
      throw new ForbiddenException(
        "Only the listing owner can manage its offers",
      );
    }

    const offer = await repository.findOneBy({ id, listingId: listing.id });
    if (!offer) {
      throw new NotFoundException("Offer not found");
    }
    if (offer.status !== OfferStatus.PENDING) {
      throw new ConflictException("Offer is no longer pending");
    }

    return { offer, listing };
  }

  private async assertListingAvailable(
    manager: EntityManager,
    listing: Awaited<ReturnType<typeof lockListing>>,
  ) {
    if (listing.status !== ListingStatus.ACTIVE) {
      throw new ConflictException("Listing is not open for offers");
    }

    const activeCategory = await manager.existsBy(Category, {
      id: listing.category_id,
      isActive: true,
    });
    if (!activeCategory) {
      throw new ConflictException("Listing category is inactive");
    }

    const hasReservation = await manager.existsBy(Transaction, {
      listingId: listing.id,
      status: TransactionStatus.RESERVED,
    });
    if (hasReservation) {
      throw new ConflictException("Listing already has a reserved transaction");
    }
  }
}
