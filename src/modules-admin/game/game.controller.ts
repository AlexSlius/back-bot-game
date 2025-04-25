import { Controller, Get, Post, Body, Patch, Param, Headers, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { toNumberArray } from 'src/common/helpers/array-h';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  findAll(
    @Headers('authorization') authorization: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('cities') sitiesRaw: string | string[],
    @Query('statuses') statusesRaw: string | string[],
    @Query('search') search: string = '',
    @Query('dateFrom') dateFrom: Date = undefined,
    @Query('dateTo') dateTo: Date = undefined,
  ) {
    const sities = toNumberArray(sitiesRaw);
    const statuses = toNumberArray(statusesRaw);

    return this.gameService.findAll({
      authorization,
      page: +page,
      limit: +limit,
      sities,
      statuses,
      search,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }
}
