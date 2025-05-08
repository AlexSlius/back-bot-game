import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

import { dataUtcToTimeZona } from 'src/common/helpers/date-utc-to-timezona';
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

  async findAll({
    authorization,
    page,
    limit,
    gamesId,
    teams,
    captains,
    phones,
    cities,
    statuses,
    dateFrom,
    dateTo,
  }: {
    authorization: string;
    page: number;
    limit: number;
    gamesId: number[];
    teams: string[];
    captains: string[];
    phones: string[];
    cities: number[];
    statuses: number[];
    dateFrom: Date;
    dateTo: Date;
  }) {
    const skip = (page - 1) * limit;
    const spliteToken: string[] = authorization.split(" ");

    const resUser = await this.prisma.auth.findUnique({
      where: {
        token: spliteToken[1],
      },
      include: {
        user: {
          include: {
            city: true
          }
        }
      }
    });

    const userModer = resUser.user.roleId == 1;

    let filterCity = [];

    if (cities?.length) {
      filterCity = cities;
    } else {
      if (userModer) {
        filterCity = [];
      }

      if (!userModer) {
        filterCity = resUser.user.city.map((el: { id: number }) => el.id);
      }
    }

    const where = {
      ...(filterCity?.length && {
        cityId: {
          in: filterCity,
        },
      }),
      ...(gamesId?.length && {
        gameId: {
          in: gamesId,
        },
      }),
      ...(teams?.length && {
        name: {
          in: teams,
        },
      }),
      ...(statuses?.length && {
        statusId: {
          in: statuses,
        },
      }),
      ...(phones?.length && {
        phone: {
          in: phones,
        },
      }),
      ...(captains?.length && {
        captain: {
          in: captains,
        },
      }),
      ...(dateFrom || dateTo ? {
        createdAt: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        }
      } : {})
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.team.findMany({
        where,
        include: {
          game: true,
          city: {
            include: {
              tineZone: true
            }
          },
          status: true
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),

      this.prisma.team.count({
        where
      }),
    ]);

    return {
      data: items.map((el: any) => ({ ...el, createdAt: dataUtcToTimeZona(el.createdAt, el.city.tineZone.name) })),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  }

  async exportTeamsToExcel({
    res,
    authorization,
    gamesId,
    teams,
    captains,
    phones,
    cities,
    statuses,
    dateFrom,
    dateTo,
  }: {
    res: Response;
    authorization?: string;
    gamesId: number[];
    teams: string[];
    captains: string[];
    phones: string[];
    cities: number[];
    statuses: number[];
    dateFrom: Date;
    dateTo: Date;
  }) {
    const spliteToken: string[] = authorization.split(" ");

    const resUser = await this.prisma.auth.findUnique({
      where: {
        token: spliteToken[1],
      },
      include: {
        user: {
          include: {
            city: true
          }
        }
      }
    });

    const userModer = resUser.user.roleId == 1;

    let filterCity = [];

    if (cities?.length) {
      filterCity = cities;
    } else {
      if (userModer) {
        filterCity = [];
      }

      if (!userModer) {
        filterCity = resUser.user.city.map((el: { id: number }) => el.id);
      }
    }

    const where = {
      ...(cities?.length && {
        cityId: {
          in: cities,
        },
      }),
      ...(gamesId?.length && {
        gameId: {
          in: gamesId,
        },
      }),
      ...(teams?.length && {
        name: {
          in: teams,
        },
      }),
      ...(statuses?.length && {
        statusId: {
          in: statuses,
        },
      }),
      ...(phones?.length && {
        phone: {
          in: phones,
        },
      }),
      ...(captains?.length && {
        captain: {
          in: captains,
        },
      }),
      ...(dateFrom || dateTo ? {
        createdAt: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        }
      } : {})
    };

    const resTeams = await this.prisma.team.findMany({
      where,
      include: {
        game: true,
        city: {
          include: {
            tineZone: true
          }
        },
        status: true
      },
      orderBy: { id: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Teams');

    // Columns
    worksheet.columns = [
      { header: 'Назва команди', key: 'name', width: 25 },
      { header: 'Капітан', key: 'captain', width: 20 },
      { header: 'Телефон', key: 'phone', width: 18 },
      { header: 'Нікнейм', key: 'nickname', width: 18 },
      { header: 'Гравці', key: 'players', width: 10 },
      { header: 'Новачки', key: 'playersNew', width: 10 },
      { header: 'Місто', key: 'city', width: 15 },
      { header: 'Гра', key: 'game', width: 20 },
      { header: 'Статус', key: 'status', width: 15 },
      { header: 'Бажання', key: 'wish', width: 30 },
      { header: 'Примітка', key: 'note', width: 30 },
      { header: 'Дата створення', key: 'createdAt', width: 20 },
    ];

    // Data
    resTeams.forEach(team => {
      worksheet.addRow({
        name: team.name,
        captain: team.captain,
        phone: team.phone,
        nickname: team.nickname || '',
        players: team.players,
        playersNew: team.playersNew,
        city: team.city.name,
        game: team.game.name,
        status: team.status.name,
        wish: team.wish || '',
        note: team.note || '',
        createdAt: dataUtcToTimeZona(team.createdAt, team.city.tineZone.name)
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader('Content-Disposition', 'attachment; filename=teams.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async findOne(id: number) {
    const res = await this.prisma.team.findUnique({
      where: {
        id
      },
      include: {
        game: true,
        city: {
          include: {
            tineZone: true
          }
        },
        status: true
      },
    });

    if (!res?.id) {
      return {
        data: null
      }
    }

    return {
      data: { ...res, createdAt: dataUtcToTimeZona(res.createdAt, res.city.tineZone.name) }
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const {
      name,
      captain,
      phone,
      chatId,
      nickname,
      gameId,
      cityId,
      players,
      playersNew,
      statusId,
      wish,
      note,
    } = updateTeamDto;
    const res = await this.prisma.team.update({
      where: {
        id
      },
      data: {
        name,
        captain,
        phone,
        chatId,
        nickname,
        game: gameId ? {
          connect: { id: gameId }
        } : undefined,
        city: cityId ? {
          connect: { id: cityId }
        } : undefined,
        players,
        playersNew,
        status: statusId ? {
          connect: { id: statusId }
        } : undefined,
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

  async getTeamFilters(authorization: string) {
    const spliteToken: string[] = authorization.split(" ");

    const resUser = await this.prisma.auth.findUnique({
      where: {
        token: spliteToken[1],
      },
      include: {
        user: {
          include: {
            city: true
          }
        }
      }
    });

    const userModer = resUser.user.roleId == 1;

    const where = {
      ...(!userModer && {
        cityId: {
          in: resUser.user.city.map((el: { id: number }) => el.id),
        },
      })
    }

    const captainsRaw = await this.prisma.team.findMany({
      where,
      distinct: ['captain'],
      select: { captain: true },
    });

    const phonesRaw = await this.prisma.team.findMany({
      where,
      distinct: ['phone'],
      select: { phone: true },
    });

    const namesRaw = await this.prisma.team.findMany({
      where,
      distinct: ['name'],
      select: { name: true },
    });

    const teamGames = await this.prisma.team.findMany({
      where,
      select: { gameId: true },
      distinct: ['gameId'],
    });

    const gameIds = teamGames.map(t => t.gameId);

    const gamesRaw = await this.prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    });

    return {
      captains: captainsRaw.map((t) => t.captain),
      phones: phonesRaw.map((t) => t.phone),
      names: namesRaw.map((t) => t.name),
      games: gamesRaw.map((t) => ({ id: t.id, name: t.name })),
    };
  }
}
