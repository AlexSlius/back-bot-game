import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCityDto: CreateCityDto) {
    const res = await this.prisma.city.create({
      data: {
        name: createCityDto.name,
        tineZone: {
          connect: { id: createCityDto.timeZoneId, }
        },
        status: {
          connect: { id: createCityDto.statusId ?? 1 }
        }
      }
    });

    return {
      data: {
        isAdd: !!res?.id
      }
    }
  }

  async findAll({ page, limit, search }: { page: number, limit: number, search: string }) {
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.city.findMany({
        where,
        include: {
          status: true,
          tineZone: true
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),

      this.prisma.city.count(),
    ]);

    return {
      data: items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const city = await this.prisma.city.findUnique({
      where: {
        id
      },
      include: {
        status: true,
        tineZone: true
      }
    })

    if (!city)
      return {
        data: null
      }

    return {
      data: city
    };
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const res = await this.prisma.city.update({
      where: {
        id,
      },
      data: {
        name: updateCityDto.name,
        tineZone: updateCityDto.timeZoneId ? {
          connect: { id: updateCityDto.timeZoneId }
        } : undefined,
        status: updateCityDto.statusId ? {
          connect: { id: updateCityDto.statusId }
        } : {
          connect: { id: 1 },
        },
      },
    });

    return {
      data: {
        isUpdate: !!res?.id
      }
    }
  }
}
