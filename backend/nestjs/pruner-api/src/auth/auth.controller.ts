/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  Body,
//   UseGuards,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  NotAcceptableException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

/**
 * Controller responsible for handling authentication-related requests.
 */
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    // Add Logger
    private readonly logger = new Logger(AuthService.name);

    /**
     * Endpoint to check if a username already exists.
     * @param username - The username to check.
     * @returns An object indicating whether the username exists or not.
     */
    @Get('check-username/:username')
    async checkUsername(@Param('username') username: string) {
        if (!username) {
            throw new BadRequestException();
        }
        this.logger.log(`Checking username: ${username}`);
      const exists = await this.authService.doesUsernameExist(username);
      return { exists };
    }

    /**
     * Endpoint to perform user login.
     * @param loginDto - The login credentials.
     * @returns The authentication token if login is successful.
     * @throws UnauthorizedException if the login credentials are invalid.
     */
    // @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const { identifier, password } = loginDto;
        if (!identifier || !password) {
            throw new NotAcceptableException();
        }
        const user = await this.authService.validateUser(identifier, password);
        if(!user) {
            throw new UnauthorizedException({message: 'Invalid credentials'});
        }
        this.logger.log(`Logging in user: ${user.username}`);
        await this.authService.login(user, res);

        return res.status(HttpStatus.OK).json({
            data: {
                destination: 'dashboard',
            },
            message: 'Login Successful',
        });
    }

    /**
     * Endpoint to register a new user.
     * @param registerDto - The user registration details.
     * @returns An object containing the registered user's data, a success message, and any errors.
     * @throws HttpException if registration fails.
     */
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        try {
            const user = await this.authService.register(registerDto.email, registerDto.username, registerDto.password);
            return {
                data: user,
                message: "Registration Successful",
                errors: null,
            };
        } catch (error) {
            // Optionally log the error in a secure manner
            // console.error(error);
    
            throw new HttpException({
                data: null,
                message: 'Registration Failed',
                errors: { message: 'An error occurred during registration' }
            }, HttpStatus.BAD_REQUEST);
        }
    }    

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
      const refreshToken = req.cookies['refresh_token'];
      const newAccessToken = await this.authService.refreshAccessToken(refreshToken, res);
      res.json(newAccessToken);
    }

}
