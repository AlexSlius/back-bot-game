import { PrismaClient } from '@prisma/client';

import listTimeZones from "../../static-files/timezones.json";

const prisma = new PrismaClient();

export async function seedTimezone() {
    console.log('Start seeding timezone...');

    const exists = await prisma.timeZone.findFirst();

    if (exists) {
        console.log('🔸 Timezone already seeded');
        return;
    }

    // list timezones
    await prisma.timeZone.createMany({
        data: listTimeZones
    });

    console.log('✅ Seed timezone completed');
}