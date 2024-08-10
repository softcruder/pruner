import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UrlShortenerService],
  imports: [HttpModule],
  controllers: [UrlShortenerController],
})
export class UrlShortenerModule {}
