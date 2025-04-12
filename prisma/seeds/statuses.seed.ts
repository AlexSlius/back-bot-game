import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedStatuses() {
    console.log('Start seeding status...');

    const exists = await prisma.status.findFirst();

    if (exists) {
        console.log('🔸 Statuses already seeded');
        return;
    }

    await prisma.status.createMany({
        data: [
            {
                name: "Активний",
                color: "green"
            },
            {
                name: "Неактивний",
                color: "red"
            },
            {
                name: "Резерв",
                color: "orange"
            },
            {
                name: "Чернетка",
                color: "blue"
            }
        ]
    });

    console.log('✅ Seed statuses completed');
}