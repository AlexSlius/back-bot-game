import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Making the module global to simplify imports
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // Adding the service to the export list
})

export class PrismaModule { }
