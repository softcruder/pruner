/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private encryptionKey = process.env.ENCRYPT_KEY || '1b381197a7c3a59e6dd23f22bd7dx469'; // Securely set this in environment variables
  private apiKey = process.env.API_KEY;
  private ivLength = 16; // For AES, this is usually 16 bytes

  // Function to encrypt data
  private encrypt(textToEncrypt: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey),
      iv,
    );
    let encrypted = cipher.update(textToEncrypt);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Combine the IV and encrypted text and return it as a hexadecimal string
    return `${encrypted.toString('hex')}:div${iv.toString('hex')}`;
  }

  // Function to decrypt data
  private decrypt(encryptedText: string): string {
    const [encrypted, ivHex] = encryptedText.split(':div');
    const iv = Buffer.from(ivHex.replace('ed.', ''), 'hex');
    const encryptedBuffer = Buffer.from(encrypted, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey),
      iv,
    );
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const apikey = req.headers['plken'];
    const bhash = req.headers['x-bhash'];

    if (!apikey || apikey !== (process.env.API_KEY || this.apiKey)) {
      throw new UnauthorizedException('Forbidden Resource');
    }

    if ([
        // 'POST', 
        // 'PATCH', 
        'PUT'].includes(req.method)) {
      if (!bhash) {
        throw new UnauthorizedException('Please update your app');
      }
      try {
        // Decrypt the payload
        const decryptedPayload = this.decrypt(bhash as string);

        // Ensure decrypted data matches the original request body
        const originalBody = JSON.stringify(req.body.originalBody);

        if (decryptedPayload !== originalBody) {
          throw new BadRequestException('Invalid payload.');
        }

        // Replace the body with the original content
        req.body = JSON.parse(decryptedPayload);
      } catch (error) {
        throw new BadRequestException('Please update your app');
      }
    }

    next();
  }
}
