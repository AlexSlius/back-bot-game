import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SendEmail } from 'src/common/services/mail.service';

@Module({
  controllers: [UserController],
  providers: [UserService, SendEmail],
})
export class UserModule { }
