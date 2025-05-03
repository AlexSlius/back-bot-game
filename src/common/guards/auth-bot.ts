import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export class AuthBotGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['x-api-key'];

        if (!request.url.startsWith('/api/bot')) {
            return true;
        }

        if (apiKey && apiKey === process.env.API_KEY) {
            return true;
        }

        return false;
    }
}