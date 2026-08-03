import prisma from './src/lib/prisma.js';

async function run() {
  try {
    const updates = { company_name: 'Mhatre Traders' };
    const keys = Object.keys(updates);
    const results = await prisma.$transaction(async (tx) => {
      const outputs = [];
      for (const key of keys) {
        const setting = await tx.setting.findUnique({ where: { key } });
        if (setting) {
          const updated = await tx.setting.update({
            where: { key },
            data: { value: String(updates[key]) }
          });
          outputs.push(updated);
        }
      }
      return outputs;
    });
    console.log('Success:', results);
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit();
}
run();
