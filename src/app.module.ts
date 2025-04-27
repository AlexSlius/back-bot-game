import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from '../prisma/prisma.module';
import { AdminModule } from './modules-admin/admin.module';
import { BotModule } from './modules-bot/bot.module';
import { AppController } from './app.controller';
import { PrismaExceptionFilter } from './common/filters/prisma-graphql-exception.filter';
import { GameStatusCheckerService } from './tasks/game-status-checker.service';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    BotModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    GameStatusCheckerService,
  ],
})
export class AppModule { }
