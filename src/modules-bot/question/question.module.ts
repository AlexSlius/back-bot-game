import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SendEmail } from 'src/common/services/mail.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, SendEmail],
})
export class QuestionModule { }
