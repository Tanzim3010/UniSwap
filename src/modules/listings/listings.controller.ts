import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { ValidationPipe } from "@/common/pipes/validation.pipe";

import { ListListingsQueryDto } from "@/modules/listings/dto/list-listings-query.dto";
import {
  CreateListingDto,
  UpdateListingDto,
} from "@/modules/listings/dto/listing.dto";
import { ListingsService } from "@/modules/listings/listings.service";

@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(@Query(new ValidationPipe()) query: ListListingsQueryDto) {
    return this.listingsService.findAll(query);
  }

  @Get("mine")
  @UseGuards(JwtGuard)
  findMine(
    @CurrentUser() user: AuthUser,
    @Query(new ValidationPipe()) query: ListListingsQueryDto,
  ) {
    return this.listingsService.findMine(user.id, query);
  }

  @Get(":id")
  findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.listingsService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ValidationPipe()) dto: CreateListingDto,
  ) {
    return this.listingsService.create(user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtGuard)
  update(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, user.id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtGuard)
  remove(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.listingsService.remove(id, user.id);
  }
}
