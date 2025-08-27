import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

@Module({
  imports: [HttpModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule { }
