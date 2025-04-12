import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
    console.log('Start seeding role...');

    const exists = await prisma.role.findFirst();

    if (exists) {
        console.log('🔸 Roles already seeded');
        return;
    }

    await prisma.role.createMany({
        data: [
            {
                name: "Модератор"
            },
            {
                name: "Організатор"
            }
        ]
    });

    console.log('✅ Seed roles completed');
}