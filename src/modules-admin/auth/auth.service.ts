import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordServis } from 'src/common/services/password.services';
import { PrismaService } from 'prisma/prisma.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import ua from "src/translations/ua.json";


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordServis: PasswordServis,
    private readonly jwtService: JwtService,
  ) { }

  async login({ email, password }: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        status: true,
      }
    });

    if (!user || user?.status?.id !== 1)
      throw new NotFoundException([ua.errorLogin]);

    const isTheSame = await this.passwordServis.comparePassword(password, user.password);

    if (!isTheSame)
      throw new NotFoundException([ua.errorLogin]);

    const payload = { sub: user.id, role: user.roleId };
    const token = this.jwtService.sign(payload);

    await this.prisma.auth.create({
      data: {
        token,
        user: {
          connect: { id: user.id }
        }
      }
    });

    return {
      token
    }
  }

  async logout(authorization: string) {
    if (!authorization) {
      throw new NotFoundException([ua.errorToken]);
    }

    const spliteToken: string[] = authorization.split(" ");

    if (spliteToken.length !== 2) {
      throw new NotFoundException([ua.errorToken]);
    }

    const res = await this.prisma.auth.delete({
      where: {
        token: spliteToken[1]
      }
    })

    return {
      status: !!res?.id
    };
  }
}
