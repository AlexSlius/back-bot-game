import { Controller, Get, Post, Body, Patch, Param, UseGuards, Res, Query } from '@nestjs/common';
import { Response } from 'express';

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
    @Query('gamesId') gamesId: number[] = [],
    @Query('teams') teams: string[] = [],
    @Query('captains') captains: string[] = [],
    @Query('phones') phones: string[] = [],
    @Query('citiesId') citiesId: number[] = [],
    @Query('statusesId') statusesId: number[] = [],
    @Query('dateFrom') dateFrom: Date = undefined,
    @Query('dateTo') dateTo: Date = undefined,
  ) {
    return this.teamService.findAll({
      page: +page,
      limit: +limit,
      gamesId,
      teams,
      captains,
      phones,
      citiesId,
      statusesId,
      dateFrom,
      dateTo,
    });
  }

  @Get('export')
  async export(
    @Res() res: Response,
    @Query('gamesId') gamesId: number[] = [],
    @Query('teams') teams: string[] = [],
    @Query('captains') captains: string[] = [],
    @Query('phones') phones: string[] = [],
    @Query('citiesId') citiesId: number[] = [],
    @Query('statusesId') statusesId: number[] = [],
    @Query('dateFrom') dateFrom: Date = undefined,
    @Query('dateTo') dateTo: Date = undefined,
  ) {
    return this.teamService.exportTeamsToExcel({
      res,
      gamesId,
      teams,
      captains,
      phones,
      citiesId,
      statusesId,
      dateFrom,
      dateTo,
    });
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
