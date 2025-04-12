import { Module } from '@nestjs/common';
import { TimeZoneService } from './time-zone.service';
import { TimeZoneController } from './time-zone.controller';

@Module({
  controllers: [TimeZoneController],
  providers: [TimeZoneService],
})
export class TimeZoneModule {}
