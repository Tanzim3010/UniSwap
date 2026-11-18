import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";


import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

import { User } from "../users/entities/user.entity";
import { Listing } from "../listings/entities/listing.entity";


@Module({
    imports:[
        TypeOrmModule.forFeature([User,Listing]),
    ],
    controllers:[AdminController],
    providers:[AdminService],
    exports:[AdminService],
})

export class AdminModule{}