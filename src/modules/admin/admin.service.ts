import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Listing } from "../listings/entities/listing.entity";
import { UserStatus } from "@/src/common/enums/user-status.enum";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        @InjectRepository(Listing)
        private readonly listingRepository:Repository<Listing>,
    

    ) {}

        getAllUsers() {
            return this.userRepository.find({
                select: {
                    id: true,
                    email: true,
                    displayName: true,
                    role: true,
                    status: true,
                    isVerified: true,
                    createdAt: true,
                    updatedAt: true,
                },
                order: { createdAt: "DESC" },
            });
        }

        async getUserById(id: string) {
            const user = await this.userRepository.findOne({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    displayName: true,
                    role: true,
                    status: true,
                    isVerified: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            if (!user) {
                throw new NotFoundException("User not found");
            }

            return user;
        }

            async suspendUser (id:string){
            const user = await this.userRepository.findOne({
                where:{id},
            });
            if(!user){
                throw new NotFoundException("User Not Fount!!!!!!!");
            }
            user.status = UserStatus.SUSPENDED;

            return this.userRepository.save(user);
        }


            async activateUser (id:string){
            const user = await this.userRepository.findOne({
                where:{id},
            });
            if(!user){
                throw new NotFoundException("User Not Fount!!!!!");
            }
            user.status = UserStatus.ACTIVE;

            return this.userRepository.save(user);
        }


        async removeListing (id:string){
            const listing = await this.listingRepository.findOne({
                where : {id},
            });
            if(!listing){
                throw new NotFoundException("List not found!!!!!")
            }
            await this.listingRepository.remove(listing);
            return {
                message:"Listing Removed Successfully"
            };
        }
}