import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listAdmins() {
    try {
        const admins = await prisma.adminUser.findMany({
            select: { email: true, name: true, role: true }
        });
        console.log('--- Registered Admin Users ---');
        console.log(JSON.stringify(admins, null, 2));
    } catch (error: any) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

listAdmins();
