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

  async findAll({ page, limit }: { page: number, limit: number }) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.team.findMany({
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
