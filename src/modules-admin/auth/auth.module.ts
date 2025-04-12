import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordServis } from 'src/common/services/password.services';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordServis],
})
export class AuthModule { }
