import { Controller, Get, Query } from '@nestjs/common';
import { TimeZoneService } from './time-zone.service';

@Controller()
export class TimeZoneController {
  constructor(private readonly timeZoneService: TimeZoneService) { }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.timeZoneService.findAll(search);
  }
}