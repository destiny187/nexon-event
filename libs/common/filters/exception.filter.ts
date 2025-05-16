import {
    ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger
} from '@nestjs/common';
import { Response } from 'express';
import {ApiResponse} from "../../shared/dto/api-response.dto";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx    = host.switchToHttp();
        const res    = ctx.getResponse<Response>();
        const req    = ctx.getRequest<Request>();

        this.logger.error(`Exception on ${req.method} ${req.url}`, exception instanceof Error ? exception.stack : String(exception));

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        const response: ApiResponse<null> = {
            code: status,
            data: null,
            message,
        };
        res.status(status).json(response);
    }
}