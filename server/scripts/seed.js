import prisma from '../src/lib/prisma.js';
import { env } from '../src/config/env.js';
import { logger } from '../src/middlewares/logging.middleware.js';
import bcrypt from 'bcrypt';

async function main() {
  logger.info('🌱 Starting manual database seeding process...');

  // 1. Production Lock Guard
  if (env.NODE_ENV === 'production') {
    logger.fatal('❌ DB SAFETY ERROR: Attempted to run seeding script in a PRODUCTION environment. Aborting execution immediately.');
    process.exit(1);
  }

  try {
    logger.info('Checking current database state for safe seeding...');
    
    // Seed default admin user if none exists
    let adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (!adminUser) {
      logger.info(`Seeding default administrator user: ${env.ADMIN_EMAIL}`);
      const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      adminUser = await prisma.user.create({
        data: {
          email: env.ADMIN_EMAIL,
          passwordHash: hashedPassword,
          name: 'Mhatre Traders Admin',
          role: 'SUPER_ADMIN'
        }
      });
      logger.info('Default admin user created successfully.');
    } else {
      logger.info('Default admin user already exists.');
    }

    // Seed default settings if none exist
    const settingsCount = await prisma.setting.count();
    if (settingsCount === 0) {
      logger.info('Seeding default company settings...');
      const defaultSettings = [
        { key: 'company_name', value: 'Mhatre Traders', type: 'STRING', description: 'Display name of the company' },
        { key: 'company_legal_name', value: 'Mhatre Traders Private Limited', type: 'STRING', description: 'Registered legal business name' },
        { key: 'company_address', value: 'Alibag, Raigad, Maharashtra, Pin: 402201', type: 'STRING', description: 'Physical company address' },
        { key: 'company_phone', value: '+91 98224 45678', type: 'STRING', description: 'Business mobile contact number' },
        { key: 'company_email', value: 'billing@mhatretraders.com', type: 'STRING', description: 'Official email ID for billing' },
        { key: 'company_gstin', value: '27DEPVC1234F1Z5', type: 'STRING', description: 'Goods and Services Tax Identification Number' },
        { key: 'bank_name', value: 'State Bank of India', type: 'STRING', description: 'Company Bank Name' },
        { key: 'bank_account_number', value: '38294029482', type: 'STRING', description: 'Company Bank Account Number' },
        { key: 'bank_ifsc', value: 'SBIN0000301', type: 'STRING', description: 'Bank IFSC Code' },
        { key: 'bank_branch', value: 'Alibag Main Branch', type: 'STRING', description: 'Bank Branch Name' },
        { key: 'invoice_prefix', value: 'MT', type: 'STRING', description: 'Prefix character code for generated invoices' }
      ];

      for (const s of defaultSettings) {
        await prisma.setting.create({ data: s });
      }
      logger.info('Successfully seeded default settings.');
    } else {
      logger.info('Settings are already populated.');
    }

    // Seed default categories if none exist
    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      logger.info('Seeding default categories...');
      
      const cementCat = await prisma.category.create({
        data: {
          title: 'Cement & Aggregates',
          slug: 'cement-aggregates',
          description: 'Premium structural cement, sand, and stone aggregates for construction foundation.',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1570979139/cement.jpg',
          visibility: true,
          displayOrder: 1,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      });

      const steelCat = await prisma.category.create({
        data: {
          title: 'Structural Steel & Rebars',
          slug: 'steel-rebars',
          description: 'High tensile reinforcement TMT bars and structural steel sections.',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1570979139/steel.jpg',
          visibility: true,
          displayOrder: 2,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      });

      const pipesCat = await prisma.category.create({
        data: {
          title: 'Pipes & Fittings',
          slug: 'pipes-fittings',
          description: 'Heavy duty plumbing pipes, UPVC/PVC conduits, and joints.',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1570979139/pipes.jpg',
          visibility: true,
          displayOrder: 3,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      });

      logger.info('Successfully seeded categories. Seeding default products...');
      
      // Seeding Products
      await prisma.product.create({
        data: {
          sku: 'CEMENT-UT-53G',
          slug: 'ultratech-cement-53-grade',
          name: 'Ultratech Cement (53 Grade)',
          description: 'Premium 53 grade cement suitable for all high load structural works.',
          unit: 'BAG',
          status: 'ACTIVE',
          featured: true,
          specifications: { grade: '53 Grade', cementType: 'OPC' },
          applications: ['Foundation', 'Columns', 'Slabs'],
          categoryId: cementCat.id,
          createdById: adminUser.id,
          updatedById: adminUser.id,
          pricing: {
            create: {
              purchasePrice: 380.00,
              sellingPrice: 450.00,
              defaultBillingRate: 440.00,
              gstRate: 28.00,
              hsnCode: '25232910'
            }
          },
          inventory: {
            create: {
              currentStock: 450,
              reorderLevel: 80,
              lastUpdatedBy: adminUser.id
            }
          }
        }
      });

      await prisma.product.create({
        data: {
          sku: 'STEEL-TT-12MM',
          slug: 'tata-tiscon-rebar-12mm',
          name: 'TATA Tiscon Rebar (12mm)',
          description: 'High tensile reinforcement TMT steel bars for high strength building columns.',
          unit: 'TON',
          status: 'ACTIVE',
          featured: true,
          specifications: { size: '12mm', type: 'Fe 550D' },
          applications: ['Beams', 'Columns', 'Foundations'],
          categoryId: steelCat.id,
          createdById: adminUser.id,
          updatedById: adminUser.id,
          pricing: {
            create: {
              purchasePrice: 58000.00,
              sellingPrice: 65000.00,
              defaultBillingRate: 63500.00,
              gstRate: 18.00,
              hsnCode: '72142090'
            }
          },
          inventory: {
            create: {
              currentStock: 12,
              reorderLevel: 3,
              lastUpdatedBy: adminUser.id
            }
          }
        }
      });

      await prisma.product.create({
        data: {
          sku: 'PIPE-AS-4PVC',
          slug: 'astral-pvc-pipe-4-inch',
          name: 'Astral PVC Pipe (4 Inch)',
          description: 'Heavy duty 4-inch PVC pipe for sewerage and plumbing drainage.',
          unit: 'PIECE',
          status: 'ACTIVE',
          featured: false,
          specifications: { size: '4 Inch', length: '10 Feet', pressure: '4 kg/cm²' },
          applications: ['Drainage', 'Rainwater Harvesting'],
          categoryId: pipesCat.id,
          createdById: adminUser.id,
          updatedById: adminUser.id,
          pricing: {
            create: {
              purchasePrice: 270.00,
              sellingPrice: 350.00,
              defaultBillingRate: 330.00,
              gstRate: 18.00,
              hsnCode: '39172310'
            }
          },
          inventory: {
            create: {
              currentStock: 150,
              reorderLevel: 25,
              lastUpdatedBy: adminUser.id
            }
          }
        }
      });

      logger.info('Successfully seeded default products, pricing, and inventory.');
    } else {
      logger.info('Products are already seeded.');
    }

    logger.info('Database safety validation complete. Seeding process finished successfully.');
    logger.info('✅ Seeding script run finished successfully.');

  } catch (error) {
    logger.error({
      msg: '❌ Seeding script encountered an exception',
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

main();
