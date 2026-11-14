import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ValidationPipe } from '@/common/pipes/validation.pipe';

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body(new ValidationPipe()) dto: RegisterDto){
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body(new ValidationPipe()) dto: LoginDto){
        return this.authService.signIn(dto);
    }
}