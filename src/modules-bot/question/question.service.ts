import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) { }

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

    return {
      data: {
        isAdd: !!res?.id
      }
    }
  }
}
