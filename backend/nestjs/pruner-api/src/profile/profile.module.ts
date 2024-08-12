import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { RateLimitingMiddleware } from 'src/common/middleware/rate-limiting.middleware';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.PATCH });
  }
}
