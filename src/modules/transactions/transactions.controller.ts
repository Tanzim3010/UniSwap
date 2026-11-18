import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { TransactionsService } from "./transactions.service";

@ApiTags("transactions")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get("my")
  getMyTransactions(@CurrentUser() user: AuthUser) {
    return this.transactionsService.getTransactionsByUserId(user.id);
  }

  @Get(":id")
  getTransaction(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.transactionsService.getTransactionById(id, user.id);
  }

  @Patch(":id/complete")
  completeTransaction(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.transactionsService.completeTransaction(id, user.id);
  }

  @Patch(":id/cancel")
  cancelTransaction(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.transactionsService.cancelTransaction(id, user.id);
  }
}
