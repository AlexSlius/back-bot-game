import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { dataUtcToTimeZona } from 'src/common/helpers/date-utc-to-timezona';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createQuestionDto: CreateQuestionDto) {
    const {
      chatId,
      nickname,
      name,
      phone,
      cityId,
      team,
      question,
      answer,
      statusId
    } = createQuestionDto;

    const res = await this.prisma.question.create({
      data: {
        chatId,
        nickname,
        name,
        phone,
        city: {
          connect: { id: cityId }
        },
        team,
        question,
        answer,
        status: {
          connect: { id: statusId }
        }
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
    status
  }: {
    authorization: string;
    page: number;
    limit: number;
    status: number;
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

    if (!userModer) {
      filterCity = resUser.user.city.map((el: { id: number }) => el.id);
    }

    const where = {
      ...(filterCity?.length && {
        cityId: {
          in: filterCity,
        },
      }),
      ...(status && {
        statusId: status,
      }),
    };

    const [items, totalActive, totalArchive] = await this.prisma.$transaction([
      this.prisma.question.findMany({
        where,
        include: {
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

      this.prisma.question.count({
        where: {
          statusId: 9
        },
      }),

      this.prisma.question.count({
        where: {
          statusId: 8
        },
      }),
    ]);

    return {
      data: items.map((el: any) => ({ ...el, createdAt: dataUtcToTimeZona(el.createdAt, el.city.tineZone.name) })),
      totalActive: totalActive,
      totalArchive: totalArchive,
      page,
      lastPage: Math.ceil((status == 8 ? totalArchive : totalActive) / limit),
    }
  }

  async totalActive(authorization: string) {
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

    if (!userModer) {
      filterCity = resUser.user.city.map((el: { id: number }) => el.id);
    }

    const where = {
      ...(filterCity?.length && {
        cityId: {
          in: filterCity,
        },
      }),
      statusId: 9,
    };

    const questioLength = await this.prisma.question.count({
      where
    })

    return {
      data: {
        questioLength
      }
    }
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const {
      chatId,
      nickname,
      name,
      phone,
      cityId,
      team,
      question,
      answer,
      statusId
    } = updateQuestionDto;

    const data: any = {
      ...(chatId !== undefined && { chatId }),
      ...(nickname !== undefined && { nickname }),
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(team !== undefined && { team }),
      ...(question !== undefined && { question }),
      ...(answer !== undefined && { answer }),
      ...(cityId && {
        city: {
          connect: { id: cityId }
        }
      }),
      ...(statusId && {
        status: {
          connect: { id: statusId }
        }
      })
    };

    const res = await this.prisma.question.update({
      where: { id },
      data
    });

    return {
      data: {
        isAdd: !!res?.id
      }
    };
  }

}
