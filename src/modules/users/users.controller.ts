import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtGuard } from "@/src/common/guard/jwt.guard";
import { CurrentUser } from "@/src/common/decorators/current-user.decorator";
import { AuthUser } from "@/src/common/interfaces/auth-user.interface";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ValidationPipe } from "@/src/common/pipes/validation.pipe";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @UseGuards(JwtGuard)
    async getCurrentUser(@CurrentUser() authUser: AuthUser) {
        return this.usersService.getUserById(authUser.id);
        
    }

    @Patch('me')
    @UseGuards(JwtGuard)
    async updateCurrentUser(@CurrentUser() authUser: AuthUser, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(authUser.id, updateUserDto);
    }
}