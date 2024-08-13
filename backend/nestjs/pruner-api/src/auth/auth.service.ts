/* eslint-disable prettier/prettier */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express'; // Import Response for sending cookies

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Add Logger
  private readonly logger = new Logger(AuthService.name);

  /**
   * Validates user credentials.
   * @param identifier - The username or email of the user.
   * @param pass - The password of the user.
   * @returns The user object if the credentials are valid, otherwise null.
   */
  async validateUser(identifier: string, pass: string): Promise<any> {
    this.logger.log(`Validating user: ${identifier}`);
    const user = await this.findUserByIdentifier(identifier);
    this.logger.log(`Validating user password: ${identifier}`);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Logs in the user and sets access and refresh tokens in HTTP-only cookies.
   * @param user - The user object.
   * @param response - The response object to set cookies.
   * @returns An object containing user information and tokens.
   */
  async login(user: any, response: Response) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.userId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Set the access and refresh tokens as HTTP-only cookies
    this.setAuthCookies(response, accessToken, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Sets HTTP-only cookies with Secure and SameSite attributes.
   * @param response - The response object to set cookies.
   * @param accessToken - The JWT access token.
   * @param refreshToken - The JWT refresh token.
   */
  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProd = process.env.NODE_ENV === 'production';

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd, // Use secure in production
      sameSite: isProd ? 'strict' : 'lax', // Strict for production, Lax for development
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  /**
   * Handles token refresh using the refresh token.
   * @param refreshToken - The refresh token.
   * @param response - The response object to set new cookies.
   * @returns An object containing the new access token.
   */
  async refreshAccessToken(refreshToken: string, response: Response) {
    try {
      this.logger.log(`Verifying refresh token: ${refreshToken}`);
      const payload = this.jwtService.verify(refreshToken);
      this.logger.log(`Singning access token: ${payload}`);
      const newAccessToken = this.jwtService.sign(
        { username: payload.username, email: payload.email, sub: payload.sub },
        { expiresIn: '15m' },
      );

      // Set the new access token in the cookie
      this.logger.log(`Setting access token: ${newAccessToken}`);
      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Finds a user by their username or email.
   * @param identifier - The username or email of the user.
   * @returns The user object if found, otherwise null.
   */
  private async findUserByIdentifier(identifier: string) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const whereClause = isEmail
      ? { email: identifier }
      : { username: identifier };

    const user = await this.userRepository.findOne({
      where: whereClause,
    });

    return user;
  }

  /**
   * Registers a new user.
   * @param email - The email of the user.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns The newly created user object.
   * @throws ConflictException if the username or email already exists.
   */
  async register(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    // Check if username exists
    this.logger.log(`Validating duplicate username: ${username}`);
    const usernameExists = await this.doesUsernameExist(username);
    if (usernameExists) {
      throw new ConflictException('Username already exists');
    }

    // Check if email exists
    this.logger.log(`Validating duplicate user: ${email}`);
    const emailExists = await this.userRepository.findOne({ where: { email } });
    if (emailExists) {
      // Avoid giving detailed feedback to prevent email enumeration
      throw new ConflictException('Registration failed');
    }
    this.logger.log(`Registering user: ${username}`);

    const hashedPassword = bcrypt.hashSync(password, 10);
    this.logger.log(`Creating user in DB: ${new Map([[email, username]])}`);
    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  /**
   * Checks if a username already exists.
   * @param username - The username to check.
   * @returns true if the username exists, otherwise false.
   */
  async doesUsernameExist(username: string): Promise<boolean> {
    this.logger.log(`Checking duplicate username in DB: ${username}`);
    const user = await this.userRepository.findOne({ where: { username } });
    return !!user;
  }
}
