import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createGameDto: CreateGameDto) {
    const {
      name,
      image,
      cityId,
      statusId,
      isPlaces,
      places,
      beginningDateTime,
      description
    } = createGameDto;

    const res = await this.prisma.game.create({
      data: {
        name,
        image,
        city: {
          connect: { id: cityId },
        },
        status: {
          connect: { id: statusId }
        },
        isPlaces,
        places,
        beginningDateTime,
        description
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
    sities,
    statuses,
    search
  }: {
    page: number;
    limit: number;
    sities: number[];
    statuses: number[];
    search: string;
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.GameWhereInput = {
      ...(sities?.length && {
        cityId: {
          in: sities,
        },
      }),
      ...(statuses?.length && {
        statusId: {
          in: statuses,
        },
      }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.game.findMany({
        where,
        skip,
        take: limit,
        include: {
          city: true,
          status: true,
          teams: true
        },
        orderBy: { id: 'desc' }
      }),

      this.prisma.game.count({
        where
      })
    ]);

    return {
      data: items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const res = await this.prisma.game.findUnique({
      where: {
        id,
      },
      include: {
        city: true,
        status: true,
        teams: true
      }
    })

    return {
      data: res?.id ? res : null
    }
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const {
      name,
      image,
      cityId,
      statusId,
      isPlaces,
      places,
      beginningDateTime,
      description
    } = updateGameDto;

    const res = await this.prisma.game.update({
      where: {
        id
      },
      data: {
        name,
        image,
        city: cityId ? {
          connect: { id: cityId },
        } : undefined,
        status: statusId ? {
          connect: { id: statusId }
        } : undefined,
        isPlaces,
        places,
        beginningDateTime,
        description
      }
    });

    return {
      data: {
        isUpdate: !!res?.id
      }
    }
  }
}
