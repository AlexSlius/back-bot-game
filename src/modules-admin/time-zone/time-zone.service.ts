import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class TimeZoneService {
  constructor(private readonly prisma: PrismaService) { }

  findAll(searchQuery?: string) {
    return this.prisma.timeZone.findMany({
      take: 50,
      where: searchQuery ?
        {
          OR: [
            {
              name: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              nameUa: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          ],
        } : undefined
    });
  }
}
