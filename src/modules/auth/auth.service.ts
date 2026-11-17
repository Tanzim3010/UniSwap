import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { UserStatus } from "@/src/common/enums/user-status.enum";
import { createHash, randomBytes } from "crypto";
import { EmailVerification } from "./entities/email-verification.entity";
import { Repository } from "typeorm/repository/Repository.js";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan } from "typeorm/find-options/operator/MoreThan.js";
import { MailService } from "@/src/mails/mail.service";



@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,

        @InjectRepository(EmailVerification)
        private readonly emailVerificationRepository: Repository<EmailVerification>
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
            
            const rawToken = randomBytes(32).toString('hex');

            const tokenHash = createHash('sha256').update(rawToken).digest('hex');

            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await this.emailVerificationRepository.save(
            this.emailVerificationRepository.create({
                userId: user.id,
                tokenHash,
                expiresAt,
                verifiedAt: null,
            }),
        );

            await this.mailService.sendVerificationEmail(email, rawToken);

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

    async verifyEmail(token: string) {
        try {
            const tokenHash = createHash('sha256')
            .update(token)
            .digest('hex');

            const verification = await this.emailVerificationRepository.findOne({
            where: {
                tokenHash,
                expiresAt: MoreThan(new Date()),
            },
            relations: {
                user: true,
            },
            });

            if (!verification) {
            throw new BadRequestException(
                'Verification token is invalid or expired',
            );
            }

            if (verification.verifiedAt) {
            throw new ConflictException('Email is already verified');
            }

            verification.verifiedAt = new Date();
            await this.emailVerificationRepository.save(verification);

            verification.user.isVerified = true;
            verification.user.status = UserStatus.ACTIVE;

            await this.usersService.saveUser(verification.user);

            return {
            message: 'Email verified successfully',
            };
        } catch (error) {
            console.error('Error verifying email:', error);
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

            if(!user.isVerified || user.status === UserStatus.PENDING){
                throw new UnauthorizedException('Email is not verified');
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