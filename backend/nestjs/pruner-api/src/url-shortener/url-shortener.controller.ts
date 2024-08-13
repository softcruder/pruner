/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Param, Post, Query, Req, UseGuards, Logger } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlDto } from './dto/url.dto';
import { Url } from './entity/url.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('url')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}
  // Add Logger
private readonly logger = new Logger(UrlShortenerController.name);

  @Post('shorten')
  async shortenUrl(@Query('longUrl') longUrl: string, @Req() req: Request): Promise<Url> {
    if (!longUrl) {
        throw new BadRequestException('You must provide the url to shorten');
    }
    const user = (req as any).user; // User from JWT after authentication
    let userId: string | undefined;

    if (user) {
        userId = user.sub; // 'sub' from JWT payload (userId)
    }
    return this.urlShortenerService.shortenUrl(longUrl, userId);
  }

  @Get(':id')
  async retrieveLongUrl(@Param('id') id: string): Promise<UrlDto> {
    if (!id) {
        throw new BadRequestException('short_id should exist');
    }
    return this.urlShortenerService.retrieveUrl(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async retrieveUserUrls(@Query('user') userId: string): Promise<UrlDto[]> {
    if (!userId) {
        throw new BadRequestException('user_id is required');
    }
    return this.urlShortenerService.retrieveUserUrl(userId);
  }
}
