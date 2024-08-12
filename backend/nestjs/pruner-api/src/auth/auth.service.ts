/* eslint-disable prettier/prettier */
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    /**
     * Validates user credentials.
     * @param identifier - The username or email of the user.
     * @param pass - The password of the user.
     * @returns The user object if the credentials are valid, otherwise null.
     */
    async validateUser(identifier: string, pass: string): Promise<any> {
        const user = await this.findUserByIdentifier(identifier);
        if (user && bcrypt.compareSync(pass, user.password)) {
            const { ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * Generates an access token for the user.
     * @param user - The user object.
     * @returns An object containing the access token.
     */
    async login(user: any) {
        const payload = { username: user.username, email: user.email, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    /**
     * Finds a user by their username or email.
     * @param identifier - The username or email of the user.
     * @returns The user object if found, otherwise null.
     */
    private async findUserByIdentifier(identifier: string) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const whereClause = isEmail ? { email: identifier } : { username: identifier };
    
        const user = await this.userRepository.findOne({
            where: whereClause
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
    async register(email: string, username: string, password: string): Promise<User> {
        // Check if username exists
        const usernameExists = await this.doesUsernameExist(username);
        if (usernameExists) {
            throw new ConflictException('Username already exists');
        }

        // Check if email exists
        const emailExists = await this.userRepository.findOne({ where: { email } });
        if (emailExists) {
            // Avoid giving detailed feedback to prevent email enumeration
            throw new ConflictException('Registration failed');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = this.userRepository.create({ email, username, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }

    /**
     * Checks if a username already exists.
     * @param username - The username to check.
     * @returns true if the username exists, otherwise false.
     */
    async doesUsernameExist(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { username } });
        return !!user;
    }
}
