import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './modules-crm/user/user.module';
import { TimeZoneModule } from './modules-crm/team/modules-crm/time-zone/time-zone.module';
import { StatusModule } from './modules-crm/status/status.module';
import { RoleModule } from './modules-crm/role/role.module';
import { ReservationModule } from './modules-crm/reservation/reservation.module';
import { QuestionModule } from './modules-crm/question/question.module';
import { GameModule } from './modules-crm/game/game.module';
import { CityModule } from './modules-crm/city/city.module';
import { AuthModule } from './modules-crm/auth/auth.module';


@Module({
  imports: [
    PrismaModule,
    UserModule,
    TimeZoneModule,
    StatusModule,
    RoleModule,
    ReservationModule,
    QuestionModule,
    GameModule,
    CityModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})


export class AppModule { }
