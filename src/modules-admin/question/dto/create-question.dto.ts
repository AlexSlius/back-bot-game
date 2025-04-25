import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    chatId: string

    @IsOptional()
    @IsString()
    nickname?: string

    @IsString()
    name: string

    @IsString()
    phone: string

    @IsNumber()
    cityId: number

    @IsString()
    team: string

    @IsString()
    question: string

    @IsString()
    answer: string

    @IsNumber()
    statusId: number
}
