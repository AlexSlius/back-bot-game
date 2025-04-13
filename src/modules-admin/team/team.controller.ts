import { Controller, Get, Post, Body, Patch, Param, UseGuards, Headers, Query } from '@nestjs/common';
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

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.teamService.findAll({ page: +page, limit: +limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }
}
