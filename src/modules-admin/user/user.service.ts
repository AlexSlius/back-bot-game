import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { name, email, roleId, statusId, cityId, password } = createUserDto;

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const res = await this.prisma.user.create({
      data: {
        name,
        email,
        role: {
          connect: { id: roleId },
        },
        status: {
          connect: { id: statusId }
        },
        city: {
          connect: cityId.map((cityId) => ({ id: cityId })),
        },
        password: hashedPassword
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
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),

      this.prisma.user.count(),
    ]);

    return {
      data: items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findCurrent(token: string) {
    const spliteToken: string[] = token.split(" ");

    const res = await this.prisma.auth.findUnique({
      where: {
        token: spliteToken?.[1] ?? ''
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    })

    return {
      data: res?.user?.[0] || null
    }
  }

  async findOne(id: number) {
    const res = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return {
      data: res || null
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, email, roleId, statusId, cityId, password } = updateUserDto;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Користувач з id ${id} не знайдений.`);
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Роль з id ${roleId} не знайдена.`);
    }

    const status = await this.prisma.status.findUnique({
      where: { id: statusId },
    });

    if (!status) {
      throw new NotFoundException(`Статус з id ${statusId} не знайдений.`);
    }

    const cities = await this.prisma.city.findMany({
      where: {
        id: {
          in: cityId,
        },
      },
    });

    if (cities.length !== cityId.length) {
      throw new NotFoundException('Деякі з вказаних міст не знайдені.');
    }

    let hashedPassword = null;
    if (password) {
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        role: {
          connect: { id: roleId },
        },
        status: {
          connect: { id: statusId },
        },
        city: {
          connect: cityId.map((cityId: number) => ({ id: cityId })),
        },
        password: hashedPassword || user.password,
      },
    });

    return {
      data: {
        isUpdate: !!updatedUser?.id
      }
    }
  }
}
