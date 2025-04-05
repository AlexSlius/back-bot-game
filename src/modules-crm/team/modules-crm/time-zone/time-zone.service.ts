import { Injectable } from '@nestjs/common';
import { CreateTimeZoneDto } from './dto/create-time-zone.dto';
import { UpdateTimeZoneDto } from './dto/update-time-zone.dto';

@Injectable()
export class TimeZoneService {
  create(createTimeZoneDto: CreateTimeZoneDto) {
    return 'This action adds a new timeZone';
  }

  findAll() {
    return `This action returns all timeZone`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeZone`;
  }

  update(id: number, updateTimeZoneDto: UpdateTimeZoneDto) {
    return `This action updates a #${id} timeZone`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeZone`;
  }
}
