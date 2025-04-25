import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateGameDto {
    @IsString()
    name: string

    @IsString()
    image: string

    @IsNumber()
    cityId: number

    @IsNumber()
    statusId: number

    @IsBoolean()
    isPlaces?: boolean

    @IsOptional()
    @IsNumber()
    places?: number

    @IsDateString()
    beginningDateTime: string

    @IsString()
    description: string
}
