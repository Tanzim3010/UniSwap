import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@/modules/auth/auth.module";
import { CategoriesModule } from "@/modules/categories/categories.module";

import { Listing } from "@/modules/listings/entities/listing.entity";
import { ListingsController } from "@/modules/listings/listings.controller";
import { ListingsService } from "@/modules/listings/listings.service";

@Module({
  imports: [TypeOrmModule.forFeature([Listing]), AuthModule, CategoriesModule],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
