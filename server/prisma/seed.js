require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ── Admin User ──────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.ADMIN_NAME || 'Admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
    },
  });
  console.log(`✅ Admin user upserted: ${adminUser.email}`);

  // ── Default Profile ─────────────────────────────────────────
  const existingProfile = await prisma.profile.findFirst();
  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        fullName: adminName,
        professionalTitle: 'Information Technology Student',
        introduction: 'Welcome to my portfolio',
        tagline: 'Passionate about building great software',
        email: adminEmail,
      },
    });
    console.log('✅ Profile updated');
  } else {
    await prisma.profile.create({
      data: {
        fullName: adminName,
        professionalTitle: 'Information Technology Student',
        introduction: 'Welcome to my portfolio',
        tagline: 'Passionate about building great software',
        email: adminEmail,
      },
    });
    console.log('✅ Profile created');
  }

  // ── Default About ───────────────────────────────────────────
  const existingAbout = await prisma.about.findFirst();
  if (existingAbout) {
    await prisma.about.update({
      where: { id: existingAbout.id },
      data: {
        biography: 'A dedicated Information Technology student with a passion for web development and software engineering.',
        interests: 'Web Development, Software Engineering, UI/UX Design',
        careerGoals: 'To become a full-stack developer and build impactful applications.',
      },
    });
    console.log('✅ About updated');
  } else {
    await prisma.about.create({
      data: {
        biography: 'A dedicated Information Technology student with a passion for web development and software engineering.',
        interests: 'Web Development, Software Engineering, UI/UX Design',
        careerGoals: 'To become a full-stack developer and build impactful applications.',
      },
    });
    console.log('✅ About created');
  }

  // ── Default Website Settings ────────────────────────────────
  const existingSettings = await prisma.websiteSettings.findFirst();
  if (existingSettings) {
    await prisma.websiteSettings.update({
      where: { id: existingSettings.id },
      data: {
        siteTitle: 'My Portfolio',
        footerText: `© ${new Date().getFullYear()} ${adminName}. All rights reserved.`,
      },
    });
    console.log('✅ Website settings updated');
  } else {
    await prisma.websiteSettings.create({
      data: {
        siteTitle: 'My Portfolio',
        footerText: `© ${new Date().getFullYear()} ${adminName}. All rights reserved.`,
      },
    });
    console.log('✅ Website settings created');
  }

  // ── Default Skill Categories ────────────────────────────────
  const categories = [
    { name: 'Programming Languages', order: 1 },
    { name: 'Frontend Development', order: 2 },
    { name: 'Backend Development', order: 3 },
    { name: 'Database Management', order: 4 },
    { name: 'Development Tools', order: 5 },
  ];

  for (const category of categories) {
    await prisma.skillCategory.upsert({
      where: { name: category.name },
      update: { order: category.order },
      create: { name: category.name, order: category.order },
    });
  }
  console.log('✅ Skill categories upserted');

  console.log('\n🎉 Database seed completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
