import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsEmail()
    @Matches(/^\d{2}-\d{5}-\d@student\.aiub\.edu$/i, {
    message: 'Email must be a valid AIUB student email',
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;
    
}