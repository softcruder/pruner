/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RedisClientType, createClient } from 'redis';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entity/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlShortenerService {
    private redisClient: RedisClientType;
    // Add Logger
    private readonly logger = new Logger(UrlShortenerService.name);

  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private httpService: HttpService
) {
    const redisUrl = process.env.REDIS_URL.split(':');
    const redisKey = process.env.REDIS_PASSWORD;
    const host = redisUrl[0];
    const redisPort = redisUrl[1];
    this.logger.log(`Creating redis client on port: ${redisPort}`);
    this.redisClient = createClient({
        password: redisKey,
        socket: {
            host,
            port: Number(redisPort),
        }
    });
    this.logger.log(`Connecting to redis: ${host}`);
    this.redisClient.connect();
}

  async shortenUrl(longUrl: string, userId?: string, username?: string): Promise<Url> {
    if (!longUrl) {
        throw new BadRequestException('Url to shorten is required');
    }

    // Check if the URL already exists and is active
    const existingUrl = await this.findByLongUrl(longUrl);
    if (existingUrl && existingUrl.is_active) {
        this.logger.warn(`URL already exists and is active: ${longUrl}`);
        return existingUrl;
    }

    // Handle rate limiting for unauthenticated users
    let key = 'unauth_users';
    if (userId) {
        key = `user:${userId}`;
    }

    const count = await this.redisClient.get(key);
    if (!userId && count && parseInt(count) >= 5) {
        throw new UnauthorizedException('You need to log in to shorten more URLs.');
    }

    if (!userId) {
        await this.redisClient.incr(key);
        await this.redisClient.expire(key, 60 * 60 * 24); // Set expiry for 24 hours
    }

    // Make a request to the Go service to generate the short_id
    const goServiceUrl = `http://localhost:8080/shorten?url=${longUrl}`;
    const response = await firstValueFrom(this.httpService.get(goServiceUrl));

    const now = new Date().toISOString();

    // If the URL exists but is not active, update it to be active again
    if (existingUrl) {
        existingUrl.is_active = true;
        existingUrl.updated_at = new Date(now);
        this.logger.log(`Reactivating URL: ${longUrl}`);
        return this.urlRepository.save(existingUrl);
    }

    // Create a new shortened URL entry
    const newUrl = this.urlRepository.create({
        short_id: response.data,
        long_url: longUrl,
        user: {
            id: userId || null,
            username: username || null,
        },
        is_active: true,
        created_at: now,
        updated_at: now
    });

    this.logger.log(`Creating new shortened URL for: ${longUrl}`);
    return this.urlRepository.save(newUrl);
}

  async retrieveUrl(id: string): Promise<Url> {

    // Find the url in the database
    const response = await this.findByShortId(id);

    // Return the data from the database
    return response;
  }

  async retrieveUserUrl(userId: string): Promise<Url[]> {

    // Make a GET request to the Go service
    const response = await this.findByUsername(userId);

    // Return the data from the Go service
    return response;
  }

  async findByShortId(shortId: string): Promise<Url> {
    return this.urlRepository.findOne({ where: {short_id: shortId} });
  }

  async findByLongUrl(longurl: string): Promise<Url> {
    return this.urlRepository.findOne({ where: {long_url: longurl} });
  }

  async findByUsername(username: string): Promise<Url[]> {
      return this.urlRepository.find({ where: { user: { username: username } } });
  }

}
