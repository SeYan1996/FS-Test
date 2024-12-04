import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestException.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
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
  private flattenValidationErrors(validationErrors: ValidationError[]): string {
    const messages: string[] = this.extractMessages(validationErrors);
    return messages.join(', ');
  }

  private extractMessages(
    validationErrors: ValidationError[],
    parentPath: string = ' ',
  ): string[] {
    let messages: string[] = [];

    for (const error of validationErrors) {
      const propertyPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;

      if (error.constraints) {
        messages = messages.concat(
          Object.values(error.constraints).map(
            (message) => `${propertyPath}: ${message}`,
          ),
        );
      }

      if (error.children && error.children.length > 0) {
        messages = messages.concat(
          this.extractMessages(error.children, propertyPath),
        );
      }
    }

    return messages;
  }
}
