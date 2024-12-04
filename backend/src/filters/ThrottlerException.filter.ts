import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ThrottlerException.name);

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    let errors = exception.getResponse()['message'];
    let message = 'Bad Request';
    if (typeof errors == 'string') {
      message = errors;
    } else if (Array.isArray(errors)) {
      message = errors.join(', ');
    }
    response.status(status).json({
      status: status,
      message,
      timestamp: Date(),
      path: request.url,
    });
  }
}
