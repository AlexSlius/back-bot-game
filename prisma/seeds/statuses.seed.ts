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
                id: 1,
                name: "Активний",
                color: "green"
            },
            {
                id: 2,
                name: "Неактивний",
                color: "red"
            },
            {
                id: 3,
                name: "Резерв",
                color: "orange"
            },
            {
                id: 4,
                name: "Чернетка",
                color: "blue"
            },
            {
                id: 5,
                name: "Скасовано",
                color: "red"
            },
            {
                id: 6,
                name: "Заяка",
                color: "blue"
            },
            {
                id: 7,
                name: "Завершено",
                color: "grey"
            },
            {
                id: 8,
                name: "Архів",
                color: "Orange"
            },
            {
                id: 9,
                name: "Нова",
                color: "green"
            },
        ]
    });

    console.log('✅ Seed statuses completed');
}