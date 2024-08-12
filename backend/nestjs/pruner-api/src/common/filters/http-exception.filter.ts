/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const httpCtx = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors = { message };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as { message: string, error?: any };
      message = response.message || message;
      errors = response.error || { message };
    } else if (exception instanceof Error) {
      // Handling non-HttpExceptions
      message = exception.message;
    }

    // Log detailed error information for debugging purposes
    console.error('Error:', {
      request: {
        body: request.body,
        headers: request.headers,
        method: request.method
    },
      status,
      message,
      stack: exception instanceof Error ? exception.stack : null,
      path: request.url,
    });

    httpCtx.status(status).json({
      data: null,
      message,
      errors,
    });
  }
}
