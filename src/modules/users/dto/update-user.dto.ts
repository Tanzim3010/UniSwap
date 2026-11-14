import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    displayName?: string;
}