/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'identifier',
            passwordField: 'password',
        });
    }

    async validate(identifier: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(identifier, password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        return user;
    }
}