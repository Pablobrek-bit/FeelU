/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnsupportedMediaTypeException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AppException } from '../../../shared/exception/AppException';
import type { ResponseBodyType } from '../../../shared/exception/ResponseBody';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    this.logger.error(
      'Global exception filter',
      exception.message,
      exception.stack,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: ResponseBodyType<any> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        exception instanceof BadRequestException &&
        typeof exceptionResponse === 'object'
      ) {
        responseBody.message = exceptionResponse;
        responseBody.statusCode = status;
        if (typeof responseBody.statusCode === 'undefined') {
          responseBody.statusCode = status;
        }
      } else {
        const message =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any)?.message || exception.message;

        responseBody = {
          statusCode: status,
          message,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }
    }

    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      responseBody = {
        statusCode: status,
        message: 'Resource not found',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    if (exception instanceof SyntaxError) {
      status = HttpStatus.BAD_REQUEST;
      responseBody = {
        statusCode: status,
        message: 'Syntax error',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    if (exception instanceof AppException) {
      status = exception.statusCode;
      responseBody = {
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    if (exception instanceof UnsupportedMediaTypeException) {
      status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      responseBody = {
        statusCode: status,
        message: 'Unsupported media type',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      responseBody = {
        statusCode: status,
        message: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      responseBody = {
        statusCode: status,
        message: 'Forbidden',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    if (exception instanceof InternalServerErrorException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode: status,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    response.status(status).json(responseBody);
  }
}
