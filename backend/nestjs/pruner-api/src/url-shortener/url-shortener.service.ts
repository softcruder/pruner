/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UrlShortenerService {
  constructor(private httpService: HttpService) {}

  async shortenUrl(longUrl: string): Promise<any> {
    const goServiceUrl = `http://localhost:8080/shorten?url=${longUrl}`;

    // Make a GET request to the Go service
    const response = await firstValueFrom(this.httpService.get(goServiceUrl));

    // Return the data from the Go service
    return response.data;
  }
}
