import {
    Controller,
    Patch,
    Delete,
    Param,
    ParseUUIDPipe,
} from "@nestjs/common";

import { AdminService } from "./admin.service";


@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) {}

    @Patch('users/:id/suspend')
    suspendUser(
        @Param('id', ParseUUIDPipe)
         id:string,
    ){
        return this.adminService.suspendUser(id);
    }

    @Patch('users/:id/suspend')
    activedUser(
        @Param('id', ParseUUIDPipe)  
        id:string,
    ){
        return this.adminService.suspendUser(id);
    }

    @Delete('Listings/:id')
    removeListing (
        @Param('id',ParseUUIDPipe) id : string ,
    ){
        return this.adminService.removeListing(id);
    }



}