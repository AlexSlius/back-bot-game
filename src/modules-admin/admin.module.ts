import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RouterModule } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';

import { UserModule } from './user/user.module';
import { TimeZoneModule } from './time-zone/time-zone.module';
import { StatusModule } from './status/status.module';
import { RoleModule } from './role/role.module';
import { QuestionModule } from './question/question.module';
import { GameModule } from './game/game.module';
import { CityModule } from './city/city.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { UploadModule } from './upload/upload.module';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomJwtStrategy } from 'src/common/strategy/custom-jwt-strategy';
import { AdminController } from './admin.controller';


@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '700h' },
        }),
        AuthModule,
        UserModule,
        TimeZoneModule,
        StatusModule,
        RoleModule,
        QuestionModule,
        GameModule,
        CityModule,
        TeamModule,
        UploadModule,
        RouterModule.register([
            {
                path: 'admin',
                children: [
                    {
                        path: 'auth',
                        module: AuthModule,
                    },
                    {
                        path: 'users',
                        module: UserModule,
                    },
                    {
                        path: 'time-zones',
                        module: TimeZoneModule,
                    },
                    {
                        path: 'teams',
                        module: TeamModule,
                    },
                    {
                        path: 'statuses',
                        module: StatusModule,
                    },
                    {
                        path: 'roles',
                        module: RoleModule,
                    },
                    {
                        path: 'questions',
                        module: QuestionModule,
                    },
                    {
                        path: 'games',
                        module: GameModule,
                    },
                    {
                        path: 'cities',
                        module: CityModule,
                    },
                    {
                        path: 'uploads',
                        module: UploadModule
                    }
                ],
            },
        ]),
    ],
    controllers: [AdminController],
    providers: [
        CustomJwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ]
})

export class AdminModule { }