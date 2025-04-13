import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty({ message: "Поле ім'я не може бути порожнім!" })
    name: string

    @IsString()
    @IsNotEmpty({ message: 'Поле капіт не може бути порожнім!' })
    captain: string

    @IsString()
    @IsNotEmpty({ message: 'Поле телефон не може бути порожнім!' })
    phone: string

    @IsString()
    chatId?: string

    @IsString()
    nickname?: string

    @IsNumber()
    @IsNotEmpty({ message: 'Поле гра не може бути порожнім!' })
    gameId: number

    @IsNumber()
    @IsNotEmpty({ message: 'Поле місто не може бути порожнім!' })
    cityId: number

    @IsNumber()
    players: number

    @IsNumber()
    playersNew: number

    @IsNumber()
    statusId?: number

    @IsString()
    wish?: string

    @IsString()
    note?: string
}
