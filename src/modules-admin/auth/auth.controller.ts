import { Controller, Headers, Post, Body, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';

import { LoginAuthDto } from './dto/login-auth.dto';

@Controller()
@UseGuards()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Public()
  @Post('logout')
  logout(@Headers('authorization') authorization: string,) {
    return this.authService.logout(authorization);
  }
}
