import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
    @IsString()
    @IsNotEmpty({ message: 'Поле email не може бути порожнім!' })
    email: string
    @IsString()
    @IsNotEmpty({ message: 'Поле password не може бути порожнім!' })
    password: string
}