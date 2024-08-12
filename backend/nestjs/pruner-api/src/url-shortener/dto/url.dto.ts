/* eslint-disable prettier/prettier */
import { IsBoolean, IsString } from 'class-validator';

export class UrlDto {
    @IsString()
    short_id: string;

    @IsBoolean()
    is_active: boolean;
}
