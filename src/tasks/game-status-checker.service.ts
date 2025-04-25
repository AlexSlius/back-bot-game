import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';
import { toZonedTime } from 'date-fns-tz';
import { addHours, isAfter } from 'date-fns';

@Injectable()
export class GameStatusCheckerService {
    private readonly logger = new Logger(GameStatusCheckerService.name);

    constructor(private readonly prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCron() {
        this.logger.log('🔄 Перевірка ігор, чи минуло 2 години після початку...');

        const games = await this.prisma.game.findMany({
            where: {
                statusId: { in: [1, 3] },
            },
            include: {
                city: {
                    include: {
                        tineZone: true
                    }
                },
            },
        });

        if (games.length === 0) {
            this.logger.log('Ігор для оновлення немає.');

            return;
        }

        const nowUtc = new Date();

        const gamesToUpdate = games.filter((game: any) => {
            const timezone = game.city.tineZone.name || 'Europe/Kiev';
            const localGameTime = toZonedTime(game.beginningDateTime, timezone);
            const deadline = addHours(localGameTime, 2);
            const localNow = toZonedTime(nowUtc, timezone);

            return isAfter(localNow, deadline);
        });

        if (gamesToUpdate.length === 0) {
            this.logger.log('Ігор для оновлення немає.');

            return;
        }

        const updatedGames = await Promise.all(
            gamesToUpdate.map(game =>
                this.prisma.game.update({
                    where: { id: game.id },
                    data: { statusId: 7 },
                })
            )
        );

        this.logger.log(`🟢 Оновлено статусів: ${updatedGames.length}`);
    }
}
