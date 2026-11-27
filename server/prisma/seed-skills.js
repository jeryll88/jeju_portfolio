require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding skills and categories into Neon DB...\n');

  const categoriesData = [
    {
      name: 'Frontend Development',
      order: 1,
      skills: [
        {
          name: 'HTML',
          description: 'Semantic markup, modern HTML5 elements, web accessibility & page hierarchy',
          proficiency: 'Advanced',
          logoUrl: '/tech-logos/html.svg',
          order: 1,
        },
        {
          name: 'CSS',
          description: 'Modern responsive styling, Flexbox, Grid systems & fluid UI animations',
          proficiency: 'Advanced',
          logoUrl: '/tech-logos/css.svg',
          order: 2,
        },
        {
          name: 'JavaScript',
          description: 'ES6+ syntax, asynchronous programming, DOM manipulation & web APIs',
          proficiency: 'Proficient',
          logoUrl: '/tech-logos/javascript.svg',
          order: 3,
        },
        {
          name: 'ReactJS',
          description: 'Component architecture, custom Hooks, State management & reactive SPAs',
          proficiency: 'Proficient',
          logoUrl: '/tech-logos/react.svg',
          order: 4,
        },
        {
          name: 'Bootstrap',
          description: 'Mobile-first responsive grid system, utility classes & UI components',
          proficiency: 'Advanced',
          logoUrl: '/tech-logos/bootstrap.svg',
          order: 5,
        },
      ],
    },
    {
      name: 'Backend Development',
      order: 2,
      skills: [
        {
          name: 'Node.js',
          description: 'Asynchronous event-driven JavaScript runtime, server routing & REST APIs',
          proficiency: 'Proficient',
          logoUrl: '/tech-logos/nodejs.svg',
          order: 1,
        },
        {
          name: 'PHP',
          description: 'Server-side application logic, OOP design, session state & database scripting',
          proficiency: 'Intermediate',
          logoUrl: '/tech-logos/php.svg',
          order: 2,
        },
        {
          name: 'JavaScript',
          description: 'Full-stack server runtime logic, Express.js middleware & microservices',
          proficiency: 'Proficient',
          logoUrl: '/tech-logos/javascript.svg',
          order: 3,
        },
      ],
    },
    {
      name: 'Database Management',
      order: 3,
      skills: [
        {
          name: 'MySQL',
          description: 'Relational database schema modeling, SQL query optimization & indexing',
          proficiency: 'Proficient',
          logoUrl: '/tech-logos/mysql.svg',
          order: 1,
        },
        {
          name: 'Neon PostgreSQL',
          description: 'Cloud serverless PostgreSQL, relational schemas, connection pooling & Prisma',
          proficiency: 'Proficient',
          logoUrl: '/tech-logos/postgresql.svg',
          order: 2,
        },
        {
          name: 'MongoDB',
          description: 'NoSQL document store, dynamic JSON collections & aggregation pipelines',
          proficiency: 'Intermediate',
          logoUrl: '/tech-logos/mongodb.svg',
          order: 3,
        },
      ],
    },
    {
      name: 'Other Tools & Platforms',
      order: 4,
      skills: [
        {
          name: 'GitHub',
          description: 'Git version control, code collaboration, pull requests & repositories',
          proficiency: 'Advanced',
          logoUrl: '/tech-logos/github.svg',
          order: 1,
        },
        {
          name: 'Vercel',
          description: 'Serverless frontend deployment, edge performance & automated CI/CD',
          proficiency: 'Proficient',
          logoUrl: '/tech-logos/vercel.svg',
          order: 2,
        },
        {
          name: 'Render',
          description: 'Cloud hosting platform for web applications, REST backend services & databases',
          proficiency: 'Intermediate',
          logoUrl: '/tech-logos/render.svg',
          order: 3,
        },
      ],
    },
  ];

  for (const catData of categoriesData) {
    // Upsert Category
    const category = await prisma.skillCategory.upsert({
      where: { name: catData.name },
      update: { order: catData.order },
      create: { name: catData.name, order: catData.order },
    });
    console.log(`📁 Category synced: ${category.name}`);

    // Upsert each skill under this category
    for (const s of catData.skills) {
      // Find existing skill by name and categoryId
      const existing = await prisma.skill.findFirst({
        where: {
          name: s.name,
          categoryId: category.id,
        },
      });

      if (existing) {
        await prisma.skill.update({
          where: { id: existing.id },
          data: {
            description: s.description,
            proficiency: s.proficiency,
            logoUrl: s.logoUrl,
            order: s.order,
            isPublished: true,
          },
        });
        console.log(`   ✏️ Updated skill: ${s.name}`);
      } else {
        await prisma.skill.create({
          data: {
            name: s.name,
            description: s.description,
            proficiency: s.proficiency,
            logoUrl: s.logoUrl,
            order: s.order,
            categoryId: category.id,
            isPublished: true,
          },
        });
        console.log(`   ✨ Created skill: ${s.name}`);
      }
    }
  }

  console.log('\n🎉 All requested skills and categories successfully seeded into Neon DB!');
}

main()
  .catch((err) => {
    console.error('❌ Seeding skills failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
