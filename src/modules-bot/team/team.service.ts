import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateTeamDto) {
    const {
      name = '',
      captain = '',
      phone = '',
      chatId = '1',
      nickname = '',
      gameId,
      cityId,
      players = 0,
      playersNew = 0,
      statusId = 1,
      wish = '',
      note = '',
    } = createUserDto;

    const game = await this.prisma.game.findUnique({
      where: {
        id: gameId
      },
      include: {
        teams: {
          where: {
            statusId: 1,
          },
          select: {
            id: true,
          },
        },
      },
    });

    let status = statusId;

    if (game.isPlaces) {
      if (game.places <= game.teams.length) {
        status = 6;
      }
    }

    const res = await this.prisma.team.create({
      data: {
        name,
        captain,
        phone,
        chatId,
        nickname,
        game: {
          connect: { id: gameId }
        },
        city: {
          connect: { id: cityId }
        },
        players,
        playersNew,
        status: {
          connect: { id: status }
        },
        wish,
        note
      },
      include: {
        game: {
          include: {
            teams: {
              where: {
                statusId: 1,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (res.game.isPlaces && res.game.statusId != 3) {
      if (res.game.places <= res.game.teams.length) {
        await this.prisma.game.update({
          where: {
            id: res.game.id
          },
          data: {
            statusId: 3
          }
        })
      }
    }

    return {
      data: {
        isAdd: !!res?.id
      }
    }
  }

  findOne(id: number, gameId: number) {
    return this.prisma.team.findUnique({
      where: {
        id,
        gameId: gameId
      },
      include: {
        game: true,
        city: true,
        status: true,
      },
    });
  }

  findFirst(gameId: number, chatId: string) {
    return this.prisma.team.findFirst({
      where: {
        gameId: gameId,
        chatId
      },
      select: {
        id: true
      }
    });
  }

  async findLastTeam(chatId: string) {
    const team = await this.prisma.team.findFirst({
      where: {
        chatId: chatId,
        name: {
          notIn: ['', '-'],
        },
        captain: {
          notIn: ['', '-'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return team;
  }

  async update(updateTeamDto: UpdateTeamDto) {
    const {
      playersNew,
      chatId,
      gameId,
      statusId,
    } = updateTeamDto;

    const getTeamCurrent = await this.prisma.team.findFirst({
      where: {
        gameId,
        chatId
      },
      select: {
        id: true
      }
    });

    const res = await this.prisma.team.update({
      where: {
        id: getTeamCurrent.id
      },
      data: {
        playersNew: playersNew ? playersNew : undefined,
        status: statusId ? {
          connect: { id: statusId }
        } : undefined,
      },
      include: {
        game: {
          include: {
            teams: {
              where: {
                statusId: 1,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (res.game.isPlaces && (res.game.statusId == 1 || res.game.statusId == 3)) {
      let statusGame = 1;

      if (res.game.places <= res.game.teams.length) {
        statusGame = 3;
      } else {
        statusGame = 1;
      }

      await this.prisma.game.update({
        where: {
          id: res.game.id
        },
        data: {
          statusId: statusGame
        }
      })
    }

    return {
      data: {
        isUpdate: !!res?.id
      }
    }
  }
}
