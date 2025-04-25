import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class CustomJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        const record = await this.prisma.auth.findUnique({
            where: {
                token: token
            },
            include: {
                user: {}
            }
        });

        if (!!record?.user?.id) {
            const { id, roleId, statusId } = record.user;

            if (statusId !== 1) {
                throw new UnauthorizedException("Доступ заборонено");
            }

            return {
                id,
                roleId
            }
        }

        return false;
    }
}
