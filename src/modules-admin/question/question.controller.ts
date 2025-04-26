import { Controller, Get, Post, Body, Patch, Param, Headers, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll(
    @Headers('authorization') authorization: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status: number = 9
  ) {
    return this.questionService.findAll({
      authorization,
      page: +page,
      limit: +limit,
      status: +status
    });
  }

  @Get('total-active')
  tatalActive(
    @Headers('authorization') authorization: string
  ) {
    return this.questionService.totalActive(authorization);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }
}
