/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AppException } from '../../../shared/exception/AppException';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    console.log('exception', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    }

    if (exception instanceof AppException) {
      status = exception.statusCode;
      message = exception.message;
    }

    if (exception instanceof UnsupportedMediaTypeException) {
      status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      message = exception.message;
    }

    if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid token';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
