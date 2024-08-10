/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';

@Controller('url')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get('shorten')
  async shortenUrl(@Query('longUrl') longUrl: string): Promise<string> {
    return this.urlShortenerService.shortenUrl(longUrl);
  }
}
