import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';

import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get('register')
  findFirst(
    @Query('gameId') gameId: string,
    @Query('chatId') chatId: string,
  ) {
    return this.teamService.findFirst(+gameId, chatId);
  }

  @Get('last')
  findLastTeam(@Query('chatId') chatId: string) {
    return this.teamService.findLastTeam(chatId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('gameId') gameId: string) {
    return this.teamService.findOne(+id, +gameId);
  }

  @Patch('update')
  update(@Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(updateTeamDto);
  }
}
