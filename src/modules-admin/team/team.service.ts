import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

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
          connect: { id: statusId }
        },
        wish,
        note
      }
    });

    return {
      data: {
        isAdd: !!res?.id
      }
    }
  }

  async findAll({
    page,
    limit,
    gamesId,
    teams,
    captains,
    phones,
    citiesId,
    statusesId,
    dateFrom,
    dateTo,
  }: {
    page: number;
    limit: number;
    gamesId: number[];
    teams: string[];
    captains: string[];
    phones: string[];
    citiesId: number[];
    statusesId: number[];
    dateFrom: Date;
    dateTo: Date;
  }) {
    const skip = (page - 1) * limit;

    const where = {
      ...(citiesId?.length && {
        cityId: {
          in: citiesId,
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
      ...(statusesId?.length && {
        statusId: {
          in: statusesId,
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
          city: true,
          status: true
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),

      this.prisma.team.count(),
    ]);

    return {
      data: items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  }

  async exportTeamsToExcel({
    res,
    gamesId,
    teams,
    captains,
    phones,
    citiesId,
    statusesId,
    dateFrom,
    dateTo,
  }: {
    res: Response;
    gamesId: number[];
    teams: string[];
    captains: string[];
    phones: string[];
    citiesId: number[];
    statusesId: number[];
    dateFrom: Date;
    dateTo: Date;
  }) {
    const where = {
      ...(citiesId?.length && {
        cityId: {
          in: citiesId,
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
      ...(statusesId?.length && {
        statusId: {
          in: statusesId,
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
        city: true,
        status: true
      },
      orderBy: { id: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Teams');

    // Columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Назва команди', key: 'name', width: 25 },
      { header: 'Капітан', key: 'captain', width: 20 },
      { header: 'Телефон', key: 'phone', width: 18 },
      { header: 'Chat ID', key: 'chatId', width: 18 },
      { header: 'Нікнейм', key: 'nickname', width: 18 },
      { header: 'Гравці', key: 'players', width: 10 },
      { header: 'Новачки', key: 'playersNew', width: 10 },
      { header: 'Місто', key: 'city', width: 15 },
      { header: 'Гра', key: 'game', width: 20 },
      { header: 'Статус', key: 'status', width: 15 },
      { header: 'Бажання', key: 'wish', width: 30 },
      { header: 'Примітка', key: 'note', width: 30 },
      { header: 'Резерв?', key: 'isReservation', width: 10 },
      { header: 'Дата створення', key: 'createdAt', width: 20 },
    ];

    // Data
    resTeams.forEach(team => {
      worksheet.addRow({
        id: team.id,
        name: team.name,
        captain: team.captain,
        phone: team.phone,
        chatId: team.chatId || '',
        nickname: team.nickname || '',
        players: team.players,
        playersNew: team.playersNew,
        city: team.city.name,
        game: team.game.name,
        status: team.status.name,
        wish: team.wish || '',
        note: team.note || '',
        isReservation: team.isReservation ? 'Так' : 'Ні',

        createdAt: team.createdAt.toLocaleString('uk-UA'), // TODO
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
        city: true,
        status: true
      },
    });

    return {
      data: res || null
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
      }
    });

    return {
      data: {
        isUpdate: !!res?.id
      }
    }
  }
}
