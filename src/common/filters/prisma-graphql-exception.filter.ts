import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        if (exception.code === 'P2025') {
            response.status(500).json({
                statusCode: 500,
                message: 'Record not found or already deleted.',
            });
        } else {
            response.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
    }
}
