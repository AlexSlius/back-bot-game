import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { dataUtcToTimeZona } from 'src/common/helpers/date-utc-to-timezona';
import { fullImagePath } from 'src/common/helpers/file-path';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';


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
    authorization,
    page,
    limit,
    sities,
    statuses,
    search,
    dateFrom,
    dateTo,
  }: {
    authorization: string;
    page: number;
    limit: number;
    sities: number[];
    statuses: number[];
    search: string;
    dateFrom: Date
    dateTo: Date
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

    if (sities?.length) {
      filterCity = sities;
    } else {
      if (userModer) {
        filterCity = [];
      }

      if (!userModer) {
        filterCity = resUser.user.city.map((el: { id: number }) => el.id);
      }
    }

    const where: Prisma.GameWhereInput = {
      ...(filterCity.length && {
        cityId: {
          in: filterCity,
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
      ...(dateFrom || dateTo ? {
        createdAt: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        }
      } : {})
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.game.findMany({
        where,
        skip,
        take: limit,
        include: {
          city: {
            include: {
              tineZone: true
            }
          },
          status: true,
          teams: {
            select: {
              id: true,
              name: true,
              statusId: true,
            },
          },
        },
        orderBy: { id: 'desc' }
      }),

      this.prisma.game.count({
        where
      })
    ]);

    return {
      data: items.map(el => ({ ...el, image: fullImagePath(el.image), beginningDateTime: dataUtcToTimeZona(el.beginningDateTime, el.city.tineZone.name) })),
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
        city: {
          include: {
            tineZone: true
          }
        },
        status: true,
        teams: true
      }
    })

    if (!res?.id) {
      return {
        data: null
      }
    }

    return {
      data: {
        ...res,
        image: fullImagePath(res.image),
        beginningDateTime: dataUtcToTimeZona(res.beginningDateTime, res.city.tineZone.name)
      }
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
