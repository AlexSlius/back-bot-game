import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

export async function seedUsers() {
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash('developCrm25', saltRounds);

    await prisma.user.create({
        data: {
            name: "Розробник",
            email: "alex.sliusarchuk@gmail.com",
            password: hashedPassword,
            role: {
                connect: { id: 1 }
            },
            status: {
                connect: { id: 1 }
            }
        }
    });
}