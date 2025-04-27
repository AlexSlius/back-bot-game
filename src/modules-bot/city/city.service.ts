import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.city.findMany({
      where: {
        statusId: 1
      }
    })
  }

  findOne(id: number) {
    return this.prisma.city.findUnique({
      where: {
        id,
        statusId: 1
      }
    })
  }
}
