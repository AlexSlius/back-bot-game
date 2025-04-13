import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsDateString } from 'class-validator';

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

    @IsNumber()
    places?: number

    @IsDateString()
    beginningDateTime: string

    @IsString()
    description: string
}
