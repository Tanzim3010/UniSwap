import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get("my")
    @UseGuards(JwtGuard)
    getMyTransactions(@CurrentUser() authUser: AuthUser) {
        return this.transactionsService.getTransactionsByUserId(authUser.id);
    }

    @Get(":id")
    @UseGuards(JwtGuard)
    getTransaction(
        @Param("id", ParseUUIDPipe) id: string,
        @CurrentUser() authUser: AuthUser,
    ) {
        return this.transactionsService.getTransactionById(id, authUser.id);
    }
}