/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Urls } from './entity/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectRepository(Urls)
    private readonly urlRepository: Repository<Urls>,
    private httpService: HttpService
) {}

  async shortenUrl(longUrl: string, userId?: string): Promise<Urls> {
    if (!longUrl) {
        throw new BadRequestException('Url to shorten is required');
    }
    const goServiceUrl = `http://localhost:8080/shorten?url=${longUrl}`;

    // Make a GET request to the Go service
    const response = await firstValueFrom(this.httpService.get(goServiceUrl));
    const now = new Date().toISOString();

    const newUrl = await this.urlRepository.save({
        short_id: response.data,
        long_url: longUrl,
        username: userId || '',
        is_active: true,
        created_at: now,
        updated_at: now
    });

    // Return the new url we created
    return newUrl;
  }

  async retrieveUrl(id: string): Promise<Urls> {

    // Find the url in the database
    const response = await this.findByShortId(id);

    // Return the data from the database
    return response;
  }

  async retrieveUserUrl(userId: string): Promise<Urls[]> {

    // Make a GET request to the Go service
    const response = await this.findByUsername(userId);

    // Return the data from the Go service
    return response;
  }

  async findByShortId(shortId: string): Promise<Urls> {
    return this.urlRepository.findOne({ where: {short_id: shortId} });
  }

  async findByUsername(username: string): Promise<Urls[]> {
    return this.urlRepository.find({ where: { username } });
  }

}
