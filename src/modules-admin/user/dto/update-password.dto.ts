import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty({ message: "Поле пароль не може бути порожнім!" })
    @MinLength(6, { message: 'Пароль має містити не менше 6 символів!' })
    password: string
}
