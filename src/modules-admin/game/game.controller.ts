import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sities') sities: number[] = [],
    @Query('statuses') statuses: number[] = [],
    @Query('search') search: string = '',
    @Query('dateFrom') dateFrom: Date = undefined,
    @Query('dateTo') dateTo: Date = undefined,
  ) {
    return this.gameService.findAll({
      page: +page,
      limit: +limit,
      sities,
      statuses,
      search,
      dateFrom,
      dateTo,
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
