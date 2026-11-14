import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { UserStatus } from "@/src/common/enums/user-status.enum";


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: RegisterDto){

        try{
            const email = dto.email.trim().toLowerCase();

            const existingUser = await this.usersService.findByEmail(email);

            if(existingUser){
                throw new ConflictException('User with this email already exists');
            }

            const passwordHash = await bcrypt.hash(dto.password, 12);

            const user = await this.usersService.createUser({
                email,
                passwordHash,
                displayName: dto.displayName.trim(),
            });

            const {passwordHash: _, ...safeUser} = user;

            return {
                message: 'User registered successfully',
                user: safeUser,
            };
        }
        catch(error){
            console.error('Error while registration:', error);
            throw error;
        }

    }

    async signIn(dto: LoginDto){
        try{
            const email = dto.email.trim().toLowerCase();

            const user = await this.usersService.findByEmail(email,true);

            if(!user){
                throw new UnauthorizedException('Invalid email or password');
            }
            if(user.status === UserStatus.SUSPENDED){
                throw new UnauthorizedException('This account is suspended');
            }

            const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);

            if(!passwordMatches){
                throw new UnauthorizedException('Invalid email or password');
            }

            const payload = {
                sub: user.id,
                email: user.email,
                roles: [user.role],
            }

            const accessToken = await this.jwtService.signAsync(payload);

            const { passwordHash: _, ...safeUser} = user;

            return {
                message: 'Logged in successfully',
                access_token: accessToken,
                user: safeUser,
            };
        }
        catch(error){
            console.error('Error while signing in:', error);
            throw error;
        }
    }
}