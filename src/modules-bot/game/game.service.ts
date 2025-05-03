import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { fullImagePath } from 'src/common/helpers/file-path';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(cityId: number) {
    const games = await this.prisma.game.findMany({
      where: {
        cityId: cityId,
        statusId: {
          in: [1, 3]
        }
      }
    })

    if (!games?.length) {
      return []
    }

    return games.map(el => ({ ...el, image: fullImagePath(el.image) }));
  }

  async findOne(id: number) {
    const game = await this.prisma.game.findUnique({
      where: {
        id,
        statusId: {
          in: [1, 3]
        }
      }
    });

    if (!game?.id) {
      return null;
    }

    return { ...game, image: fullImagePath(game.image) }
  }

  async findMyGame(chatId: string, status:number) {
    if(!chatId?.length) {
      return [];
    }

    const game = await this.prisma.game.findMany({
      where: {
        teams: {
          some: {
            chatId: chatId,
            statusId: status
          }
        },
        statusId: {
          in: [1, 3]
        }
      }
    });

    if (game)
      return game;

    return [];
  }
}
