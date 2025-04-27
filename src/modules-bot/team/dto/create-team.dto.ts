import { IsString, IsNumber } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    name: string

    @IsString()
    captain: string

    @IsString()
    phone: string

    @IsString()
    chatId?: string

    @IsString()
    nickname?: string

    @IsNumber()
    gameId: number

    @IsNumber()
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
