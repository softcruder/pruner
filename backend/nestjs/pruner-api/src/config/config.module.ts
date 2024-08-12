/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      envFilePath: '.env', // Specifies the path to your environment variables file
    }),
  ],
})
export class ConfigModule {}
