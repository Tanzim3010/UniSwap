import { NotFoundException } from "@nestjs/common";
import { EntityManager, QueryFailedError } from "typeorm";
import { ListingStatus } from "@/modules/listings/entities/listing.entity";

type ListingRow = {
  id: string;
  seller_id: string;
  category_id: string;
  status: ListingStatus;
  deleted_at: Date | null;
};

export async function lockListing(manager: EntityManager, id: string) {
  const [listing] = await manager.query<ListingRow[]>(
    `SELECT id, seller_id, category_id, status, deleted_at
     FROM listings WHERE id = $1 FOR UPDATE`,
    [id],
  );

  if (!listing) {
    throw new NotFoundException("Listing not found");
  }

  return listing;
}

export function isUniqueViolation(error: unknown, constraint?: string) {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as {
    code?: string;
    constraint?: string;
  };
  return (
    driverError.code === "23505" &&
    (constraint === undefined || driverError.constraint === constraint)
  );
}
