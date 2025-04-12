import { PrismaClient } from '@prisma/client';

import { seedRoles } from './seeds/roles.seed';
import { seedStatuses } from './seeds/statuses.seed';
import { seedTimezone } from './seeds/timezone.seed';
import { seedUsers } from './seeds/users.seed';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding main file...');

    await seedRoles();
    await seedStatuses();
    await seedTimezone();
    await seedUsers();
}

main()
    .then(() => {
        console.log('✅ Seeds completed');
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error('❌ Error seeds:', e);
        return prisma.$disconnect().then(() => process.exit(1));
    });