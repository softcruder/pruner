import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { HttpModule } from '@nestjs/axios';
import { RateLimitingMiddleware } from '../common/middleware/rate-limiting.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Urls } from './entity/url.entity';

@Module({
  providers: [UrlShortenerService],
  imports: [HttpModule, TypeOrmModule.forFeature([Urls])],
  controllers: [UrlShortenerController],
})
export class UrlShortenerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
