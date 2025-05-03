import { Controller, Get, Param, Query } from '@nestjs/common';
import { GameService } from './game.service';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Get()
  findAll(
    @Query('cityId') cityId: string
  ) {
    return this.gameService.findAll(+cityId);
  }

  @Get('my-game')
  findMyGame(
    @Query('chatId') chatId: string,
    @Query('status') status: string,
  ) {
    return this.gameService.findMyGame(chatId, +status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }
}
