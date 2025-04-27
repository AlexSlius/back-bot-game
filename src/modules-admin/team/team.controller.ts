import { Controller, Get, Post, Body, Patch, Param, Headers, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { toNumberArray, toStringArray } from 'src/common/helpers/array-h';

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
    @Headers('authorization') authorization: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('games') gamesRaw: string | string[],
    @Query('teams') teamsRaw: string | string[],
    @Query('captains') captainsRaw: string | string[],
    @Query('phones') phonesRaw: string | string[],
    @Query('cities') sitiesRaw: string | string[],
    @Query('statuses') statusesRaw: string | string[],
    @Query('dateFrom') dateFrom: Date = undefined,
    @Query('dateTo') dateTo: Date = undefined,
  ) {
    const cities = toNumberArray(sitiesRaw);
    const statuses = toNumberArray(statusesRaw);
    const gamesId = toNumberArray(gamesRaw);
    const teams = toStringArray(teamsRaw);
    const captains = toStringArray(captainsRaw);
    const phones = toStringArray(phonesRaw);

    return this.teamService.findAll({
      authorization,
      page: +page,
      limit: +limit,
      gamesId,
      teams,
      captains,
      phones,
      cities,
      statuses,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get('export')
  async export(
    @Res() res: Response,
    @Headers('authorization') authorization: string,
    @Query('games') gamesRaw: string | string[],
    @Query('teams') teamsRaw: string | string[],
    @Query('captains') captainsRaw: string | string[],
    @Query('phones') phonesRaw: string | string[],
    @Query('cities') sitiesRaw: string | string[],
    @Query('statuses') statusesRaw: string | string[],
    @Query('dateFrom') dateFrom: Date = undefined,
    @Query('dateTo') dateTo: Date = undefined,
  ) {
    const cities = toNumberArray(sitiesRaw);
    const statuses = toNumberArray(statusesRaw);
    const gamesId = toNumberArray(gamesRaw);
    const teams = toStringArray(teamsRaw);
    const captains = toStringArray(captainsRaw);
    const phones = toStringArray(phonesRaw);

    return this.teamService.exportTeamsToExcel({
      res,
      authorization,
      gamesId,
      teams,
      captains,
      phones,
      cities,
      statuses,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get('filters')
  getFilters(@Headers('authorization') authorization: string) {
    return this.teamService.getTeamFilters(authorization);
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
