import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const teamMembers = await prisma.team.findMany();

    for (const member of teamMembers) {
        if (member.phone.includes('+')) {
            const updatedPhone = member.phone.replace(/\+/g, '');

            await prisma.team.update({
                where: { id: member.id },
                data: { phone: updatedPhone },
            });
            console.log(`Updated phone for ID ${member.id}: ${updatedPhone}`);
        }
    }

    console.log('Phone numbers cleaned up successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
