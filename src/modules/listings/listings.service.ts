import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";

import { CategoriesService } from "@/modules/categories/categories.service";

import {
  ListListingsQueryDto,
  ListingSort,
} from "@/modules/listings/dto/list-listings-query.dto";
import {
  CreateListingDto,
  UpdateListingDto,
} from "@/modules/listings/dto/listing.dto";
import {
  Listing,
  ListingStatus,
} from "@/modules/listings/entities/listing.entity";

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(query: ListListingsQueryDto) {
    this.validatePriceRange(query);
    const builder = this.withPublicRelations()
      .andWhere("listing.status = :status", { status: ListingStatus.ACTIVE })
      .andWhere("category.is_active = :categoryActive", {
        categoryActive: true,
      });

    this.applyFilters(builder, query);
    this.applySorting(builder, query.sort);

    const [listings, total] = await builder
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return {
      items: listings.map((listing) => this.toResponse(listing)),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findMine(sellerId: string, query: ListListingsQueryDto) {
    this.validatePriceRange(query);
    const builder = this.withPublicRelations().andWhere(
      "seller.id = :sellerId",
      { sellerId },
    );

    this.applyFilters(builder, query);
    this.applySorting(builder, query.sort);

    const [listings, total] = await builder
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return {
      items: listings.map((listing) => this.toResponse(listing)),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findById(id: string) {
    const listing = await this.loadListing(id);

    if (listing.status !== ListingStatus.ACTIVE || !listing.category.isActive) {
      throw new NotFoundException("Listing not found");
    }

    return this.toResponse(listing);
  }

  async create(sellerId: string, dto: CreateListingDto) {
    const { categoryId, ...data } = dto;
    const category = await this.categoriesService.findActiveById(categoryId);
    const listing = this.listingRepository.create({
      ...data,
      imageUrls: dto.imageUrls ?? [],
      location: dto.location ?? null,
      category,
      seller: { id: sellerId },
    });

    const saved = await this.listingRepository.save(listing);
    return this.toResponse(await this.loadListing(saved.id));
  }

  async update(id: string, sellerId: string, dto: UpdateListingDto) {
    const listing = await this.loadOwnedListing(id, sellerId);
    const { categoryId, ...changes } = dto;

    if (categoryId !== undefined) {
      listing.category =
        await this.categoriesService.findActiveById(categoryId);
    }

    Object.assign(listing, changes);
    await this.listingRepository.save(listing);
    return this.toResponse(await this.loadListing(id));
  }

  async remove(id: string, sellerId: string): Promise<void> {
    const listing = await this.loadOwnedListing(id, sellerId);
    await this.listingRepository.softRemove(listing);
  }

  private withPublicRelations(): SelectQueryBuilder<Listing> {
    return this.listingRepository
      .createQueryBuilder("listing")
      .innerJoinAndSelect("listing.category", "category")
      .innerJoin("listing.seller", "seller")
      .addSelect(["seller.id", "seller.displayName"]);
  }

  private async loadListing(id: string): Promise<Listing> {
    const listing = await this.withPublicRelations()
      .where("listing.id = :id", { id })
      .getOne();

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    return listing;
  }

  private async loadOwnedListing(
    id: string,
    sellerId: string,
  ): Promise<Listing> {
    const listing = await this.withPublicRelations()
      .where("listing.id = :id", { id })
      .andWhere("seller.id = :sellerId", { sellerId })
      .getOne();

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    return listing;
  }

  private applyFilters(
    builder: SelectQueryBuilder<Listing>,
    query: ListListingsQueryDto,
  ): void {
    if (query.search) {
      builder.andWhere(
        "(listing.title ILIKE :search OR listing.description ILIKE :search)",
        { search: `%${query.search}%` },
      );
    }
    if (query.categoryId) {
      builder.andWhere("category.id = :categoryId", {
        categoryId: query.categoryId,
      });
    }
    if (query.minPrice !== undefined) {
      builder.andWhere("listing.price >= :minPrice", {
        minPrice: query.minPrice,
      });
    }
    if (query.maxPrice !== undefined) {
      builder.andWhere("listing.price <= :maxPrice", {
        maxPrice: query.maxPrice,
      });
    }
  }

  private applySorting(
    builder: SelectQueryBuilder<Listing>,
    sort: ListingSort,
  ): void {
    switch (sort) {
      case ListingSort.PRICE_ASC:
        builder
          .orderBy("listing.price", "ASC")
          .addOrderBy("listing.createdAt", "DESC");
        break;
      case ListingSort.PRICE_DESC:
        builder
          .orderBy("listing.price", "DESC")
          .addOrderBy("listing.createdAt", "DESC");
        break;
      default:
        builder.orderBy("listing.createdAt", "DESC");
    }
  }

  private validatePriceRange(query: ListListingsQueryDto): void {
    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      throw new BadRequestException("minPrice must not exceed maxPrice");
    }
  }

  private toResponse(listing: Listing) {
    const { seller, ...data } = listing;

    return {
      ...data,
      seller: {
        id: seller.id,
        displayName: seller.displayName,
      },
    };
  }
}
