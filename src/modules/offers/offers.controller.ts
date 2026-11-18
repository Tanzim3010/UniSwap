import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { OffersService } from "./offers.service";

@ApiTags("offers")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  createOffer(
    @CurrentUser() user: AuthUser,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    )
    dto: CreateOfferDto,
  ) {
    return this.offersService.createOffer(user.id, dto);
  }

  @Get("my")
  getMyOffers(@CurrentUser() user: AuthUser) {
    return this.offersService.getOffersByBuyerId(user.id);
  }

  @Get("listing/:listingId")
  getListingOffers(
    @CurrentUser() user: AuthUser,
    @Param("listingId", ParseUUIDPipe) listingId: string,
  ) {
    return this.offersService.getOffersForListing(listingId, user.id);
  }

  @Patch(":id/accept")
  acceptOffer(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.offersService.acceptOffer(id, user.id);
  }

  @Patch(":id/reject")
  rejectOffer(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.offersService.rejectOffer(id, user.id);
  }
}
