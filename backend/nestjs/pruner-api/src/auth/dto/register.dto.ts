/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    first_name: string;
    
    @IsString()
    last_name: string;

    @IsString()
    username: string;

    @IsString()
    email: string;

    @IsString()
    password: string;
}
