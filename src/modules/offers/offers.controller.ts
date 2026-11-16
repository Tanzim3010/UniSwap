import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { OffersService } from "./offers.service";

@Controller("offers")
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Get("my")
    @UseGuards(JwtGuard)
    getMyOffers(@CurrentUser() authUser: AuthUser) {
        return this.offersService.getOffersByBuyerId(authUser.id);
    }
}