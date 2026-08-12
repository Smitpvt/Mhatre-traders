import prisma from './src/lib/prisma.js'; prisma.$connect().then(()=>console.log('Connected!')).catch(e=>console.error(e))
