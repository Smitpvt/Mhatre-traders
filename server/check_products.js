import { PrismaClient } from '@prisma/client';

process.env.DATABASE_URL = 'postgresql://postgres.depvvbykvsoxrjztzkzx:Mhatretraders1986@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?connection_limit=2';
const prisma = new PrismaClient();

async function checkProducts() {
  const allProducts = await prisma.product.findMany({
    include: { category: true }
  });
  console.log('All Admin Products:', allProducts.length);
  allProducts.forEach(p => {
    console.log(`- ${p.name} | Status: ${p.status} | Category: ${p.category ? p.category.title : 'None'}`);
  });

  const publicProducts = await prisma.product.findMany({
    where: { status: 'ACTIVE', deletedAt: null },
    include: { category: true }
  });
  console.log('\nPublic Products:', publicProducts.length);
  
  const categories = await prisma.category.findMany({
    where: { visibility: true, deletedAt: null },
    include: { products: { where: { status: 'ACTIVE', deletedAt: null } } }
  });
  console.log('\nPublic Categories & Products count:');
  categories.forEach(c => {
    console.log(`- ${c.title} (visible: ${c.visibility}): ${c.products.length} products`);
  });

  await prisma.$disconnect();
}

checkProducts();
