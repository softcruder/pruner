/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limit configurations
const getRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 150 requests per windowMs
    message: 'Too many retrieval requests, please try again later.',
});

const writeRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 75, // limit each IP to 75 requests per windowMs (half of GET requests limit)
    message: 'Too many write requests, please try again later.',
});

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'GET') {
            getRateLimit(req, res, next);
        } else if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
            writeRateLimit(req, res, next);
        } else {
            // For other methods, bypass rate limiting
            next();
        }
    }
}
