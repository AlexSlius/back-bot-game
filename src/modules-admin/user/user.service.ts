import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'prisma/prisma.service';
import { SendEmail } from 'src/common/services/mail.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import ua from "../../translations/ua.json";
import { generatePassword } from 'src/common/helpers/generate';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendEmail: SendEmail,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { name, email, roleId, statusId, cityId, password } = createUserDto;

    try {
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

      if (!!res?.id) {
        await this.sendEmail.send({
          email: email,
          isNew: true,
          password: password,
        });

        return {
          data: {
            isAdd: true
          }
        }
      }
    } catch (error) {
      console.error('create user:', error);

      return {
        data: {
          isAdd: false
        }
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
      data: res?.user || null
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

  async update(authorization: string, id: number, updateUserDto: UpdateUserDto) {
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

    try {
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
            set: cityId.map((id: number) => ({ id })),
          },
          password: hashedPassword || user.password,
        },
      });

      if (!!updatedUser?.id) {
        if (password?.length) {
          await this.removeAllTokensForUser(authorization, updatedUser.id);

          await this.sendEmail.send({
            email: updatedUser.email,
            password: password,
          });
        }

        return {
          data: {
            isUpdate: true
          }
        }
      }
    } catch (error) {
      console.error('update user:', error);

      return {
        data: {
          isUpdate: false
        }
      }
    }
  }

  async updatePassword(authorization: string, id: number, data: UpdatePasswordDto) {
    const res = await this.prisma.user.findUnique({
      where: {
        id
      },
    });

    if (!res?.id) {
      return {
        message: [ua.recordDoesNotExist]
      }
    }

    try {
      let hashedPassword = null;
      if (data?.password) {
        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
        hashedPassword = await bcrypt.hash(data.password, saltRounds);
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword
        },
      });

      if (!!updatedUser?.id) {
        await this.removeAllTokensForUser(authorization, updatedUser.id);

        await this.sendEmail.send({
          email: updatedUser.email,
          password: data.password,
        });

        return {
          data: {
            isUpdate: true,
          }
        }
      }
    } catch (error) {
      console.error('updatePassword:', error);

      return {
        data: {
          isUpdate: false,
        }
      }
    }
  }

  async forgotPassword(email: string) {
    if (!email) {
      return {
        data: {
          status: false,
        }
      }
    }

    console.log("email: ", email);

    const res = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!res?.id) {
      return {
        data: {
          status: false,
        }
      }
    }

    try {
      const password = generatePassword();
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const updatedUser = await this.prisma.user.update({
        where: { id: res.id },
        data: { password: hashedPassword },
      });

      if (updatedUser?.id) {
        await this.prisma.auth.deleteMany({ where: { userId: updatedUser.id } });
        await this.sendEmail.send({ email, password });

        return { data: { status: true } };
      }

      return { data: { status: false } };
    } catch (error) {

      console.error('forgotPassword:', error);
      return { data: { status: false } };
    }
  }

  // remove all tokens for user
  async removeAllTokensForUser(authorization: string, id: number) {
    const spliteToken: string[] = authorization.split(" ");

    await this.prisma.auth.deleteMany({
      where: {
        userId: id,
        NOT: {
          token: spliteToken[1]
        }
      }
    })
  }
}
