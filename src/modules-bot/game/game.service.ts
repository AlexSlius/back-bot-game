import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.game.findMany({
      where: {
        statusId: {
          in: [1, 3, 5, 7]
        }
      }
    })
  }

  findOne(id: number) {
    return this.prisma.game.findUnique({
      where: {
        id,
        statusId: {
          in: [1, 3, 5, 7]
        }
      }
    })
  }
}
