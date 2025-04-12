import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class CustomJwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
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
                user: true
            }
        });

        if (!!record?.user[0]?.id)
            return true;

        return false;
    }
}
