import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect(); // Connecting to the database when initializing the module
    }

    async onModuleDestroy() {
        await this.$disconnect(); // Closing the connection when the program exits
    }
}
