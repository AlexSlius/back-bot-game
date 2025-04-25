import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Пароль має містити не менше 6 символів!' })
    password?: string
}
