/* eslint-disable prettier/prettier */
import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateUrlDto {
    @IsString()
    username: string;

    @IsString()
    short_id: string;

    @IsString()
    long_url: string;

    @IsDateString()
    created_at: string;

    @IsDateString()
    updated_at: string;

    @IsBoolean()
    is_active: boolean;
}
