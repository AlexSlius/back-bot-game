import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCityDto {
    @IsString()
    @IsNotEmpty({ message: 'Поле name не може бути порожнім!' })
    name: string
    @IsNumber()
    @IsNotEmpty({ message: 'Поле timeZone не може бути порожнім!' })
    timeZoneId: number
    @IsNumber()
    @IsNotEmpty({ message: 'Поле statusId не може бути порожнім!' })
    statusId: number
}
