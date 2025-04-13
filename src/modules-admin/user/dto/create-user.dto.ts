import { IsString, IsNumber, IsNotEmpty, IsEmail, MinLength, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: "Поле ім'я не може бути порожнім!" })
    name: string

    @IsString()
    @IsNotEmpty({ message: 'Некоректна email адреса!' })
    @IsEmail({}, { message: 'Некоректна email адреса!' })
    email: string

    @IsArray()
    @IsNumber({}, { each: true })
    cityId: number[]

    @IsNumber()
    @IsNotEmpty({ message: 'Поле роль може бути порожнім!' })
    roleId: number

    @IsNumber()
    @IsNotEmpty({ message: 'Поле status не може бути порожнім!' })
    statusId: number

    @IsString()
    @IsNotEmpty({ message: "Поле пароль не може бути порожнім!" })
    @MinLength(6, { message: 'Пароль має містити не менше 6 символів!' })
    password: string
}
