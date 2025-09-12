import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { SendEmail } from 'src/common/services/mail.service';

import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendEmail: SendEmail,
  ) { }

  async create(createQuestionDto: CreateQuestionDto) {
    const {
      chatId,
      messageId,
      nickname,
      name,
      phone,
      cityId,
      team,
      question,
      answer,
    } = createQuestionDto;

    const res = await this.prisma.question.create({
      data: {
        chatId,
        messageId,
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
          connect: { id: 9 }
        }
      }
    });

    const resUsers = await this.prisma.user.findMany({
      where: {
        city: {
          some: {
            id: cityId
          }
        }
      }
    });

    for (const user of resUsers) {
      await this.sendEmail.sendBotQuestionNotice(user.email, name, question);
    }

    return {
      data: {
        isAdd: !!res?.id
      }
    }
  }
}
