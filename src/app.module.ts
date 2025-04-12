import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { PrismaModule } from '../prisma/prisma.module';
import { AdminModule } from './modules-admin/admin.module';
import { BotModule } from './modules-bot/bot.module';
import { AppController } from './app.controller';
import { PrismaExceptionFilter } from './common/filters/prisma-graphql-exception.filter';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule { }
