import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller()
export class StatusController {
  constructor(private readonly statusService: StatusService) { }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }
}
