
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RouterModule } from '@nestjs/core';

import { BotController } from "./bot.controller";
import { CityModule } from './city/city.module';
import { GameModule } from './game/game.module';
import { TeamModule } from './team/team.module';
import { QuestionModule } from './question/question.module';
import { AuthBotGuard } from 'src/common/guards/auth-bot';

@Module({
    imports: [
        CityModule,
        GameModule,
        TeamModule,
        QuestionModule,
        RouterModule.register([
            {
                path: 'bot',
                children: [
                    {
                        path: 'cities',
                        module: CityModule,
                    },
                    {
                        path: 'games',
                        module: GameModule,
                    },
                    {
                        path: 'teams',
                        module: TeamModule,
                    },
                    {
                        path: 'questions',
                        module: QuestionModule,
                    },
                ],
            },
        ]),
    ],
    controllers: [BotController],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthBotGuard
    }]
})

export class BotModule { }