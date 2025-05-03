import { Controller, Get, Post, Body, Patch, Param, UseGuards, Headers, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleModeratorGuard } from 'src/common/guards/role-moderator';
import { Public } from 'src/common/decorators/public.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller()
@UseGuards()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(RoleModeratorGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(RoleModeratorGuard)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.userService.findAll({ page: +page, limit: +limit });
  }

  @Get('token')
  findCurrent(@Headers('authorization') authorization: string) {
    return this.userService.findCurrent(authorization);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dataEmail: { email: string }) {
    return this.userService.forgotPassword(dataEmail?.email || "");
  }

  @Patch('update-password/:id')
  updatePassword(@Headers('authorization') authorization: string, @Param('id') id: string, @Body() data: UpdatePasswordDto) {
    return this.userService.updatePassword(authorization, +id, data);
  }

  @UseGuards(RoleModeratorGuard)
  @Patch(':id')
  update(@Headers('authorization') authorization: string, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(authorization, +id, updateUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
