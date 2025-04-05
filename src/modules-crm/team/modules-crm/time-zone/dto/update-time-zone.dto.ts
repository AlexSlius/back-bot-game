import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeZoneDto } from './create-time-zone.dto';

export class UpdateTimeZoneDto extends PartialType(CreateTimeZoneDto) {}
