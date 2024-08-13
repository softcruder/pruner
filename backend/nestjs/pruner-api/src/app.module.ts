/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { SecurityMiddleware } from './common/middleware/security.middleware';
// import { ValidationPipe } from './common/pipes/validation.pipe';
// import { SanitizationPipe } from './common/pipes/sanitization.pipe';
import { ConfigModule } from './config/config.module';
import { Url } from './url-shortener/entity/url.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      // username: 'softcruder',
      // password: 'FHx4erMoZZhWfRZc',
      database: 'pruner',
      entities: [User, Url],
      synchronize: true,
    }),
    UrlShortenerModule, 
    AuthModule, 
    ProfileModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*')
  }

  // configureGlobalPipes() {
  //     this.useGlobalPipes(new ValidationPipe(), new SanitizationPipe());
  //   }
}
