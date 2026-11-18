import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from "@nestjs/common";

import { AdminService } from "./admin.service";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";


@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) {}

    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Get('users/:id')
    getUserById(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminService.getUserById(id);
    }

    @Patch('users/:id/suspend')
    suspendUser(
        @Param('id', ParseUUIDPipe)
         id:string,
    ){
        return this.adminService.suspendUser(id);
    }

    @Patch('users/:id/activate')
    activateUser(
        @Param('id', ParseUUIDPipe)
        id:string,
    ){
        return this.adminService.activateUser(id);
    }

    @Delete('listings/:id')
    removeListing (
        @Param('id',ParseUUIDPipe) id : string ,
    ){
        return this.adminService.removeListing(id);
    }



}