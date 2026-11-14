import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtGuard } from "@/src/common/guard/jwt.guard";
import { CurrentUser } from "@/src/common/decorators/current-user.decorator";
import { AuthUser } from "@/src/common/interfaces/auth-user.interface";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @UseGuards(JwtGuard)
    async getCurrentUser(@CurrentUser() authUser: AuthUser) {
        return this.usersService.getUserById(authUser.id);
    }
}