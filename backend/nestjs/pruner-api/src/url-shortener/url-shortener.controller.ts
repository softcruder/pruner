/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlDto } from './dto/url.dto';
import { Urls } from './entity/url.entity';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('url')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post('shorten')
  async shortenUrl(@Query('longUrl') longUrl: string): Promise<Urls> {
    if (!longUrl) {
        throw new BadRequestException('You must provide the url to shorten');
    }
    return this.urlShortenerService.shortenUrl(longUrl);
  }

  @Get(':id')
  async retrieveLongUrl(@Param('id') id: string): Promise<UrlDto> {
    if (!id) {
        throw new BadRequestException('short_id should exist');
    }
    return this.urlShortenerService.retrieveUrl(id);
  }

  @UseGuards(LocalAuthGuard)
  @Get('users')
  async retrieveUserUrls(@Query('user') userId: string): Promise<UrlDto[]> {
    if (!userId) {
        throw new BadRequestException('user_id is required');
    }
    return this.urlShortenerService.retrieveUserUrl(userId);
  }
}
