require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding University of Abra Website project into Neon DB...\n');

  const projectData = {
    title: 'University of Abra (UA) Web Portal & Campus CMS',
    shortDesc: 'An institutional web portal and content management system for the University of Abra, featuring academic program catalogs, admissions, student services, and administrative publishing.',
    fullDesc: 'A modular full-stack web application engineered for the University of Abra (UA). The platform serves as the primary digital gateway for prospective applicants, enrolled students, faculty, and university administration. Built with a clean PHP architecture, it delivers dynamic content rendering, college academic directories, admission procedures, campus clearance workflows, and an authenticated administrative back-office for publishing news, university memorandums, and student announcements.',
    objectives: '• Build a modern, responsive institutional web portal for University of Abra students, alumni, and prospective applicants.\n• Deliver a secure back-office administrative CMS for publishing official campus news, events, and academic updates.\n• Streamline student service discovery, program curriculums, and admission requirements.\n• Implement clean, lightweight server-side routing with PHP PDO database integration.',
    features: '• Modular PHP MVC Architecture & Lightweight Server Router\n• Comprehensive College Directories, Degree Offerings & Academic Curriculums\n• Online Admissions Portal & Student Services Guidelines\n• Administrative CMS for News, Events & Institutional Announcements\n• Database Abstraction via PHP Data Objects (PDO) for MySQL and SQLite\n• Mobile-First Responsive Design with Dark Mode Support\n• Clean URL Rewriting with Apache .htaccess and router.php\n• Open-Source GitHub Repository for Academic Collaboration',
    category: 'Web Development',
    technologies: 'PHP, MySQL, SQLite, JavaScript, HTML5, CSS3, Apache, Git',
    role: 'Full-Stack Developer (PHP Architecture, Database Design, Routing & Front-End UI)',
    githubUrl: 'https://github.com/jeryll88/ua_webiste',
    liveDemoUrl: null,
    thumbnailUrl: '/projects/ua-thumb.svg',
    status: 'Completed',
    isFeatured: true,
    isPublished: true,
    order: 2,
  };

  // Check if project exists by githubUrl or title
  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { githubUrl: projectData.githubUrl },
        { title: { contains: 'University of Abra' } },
        { title: { contains: 'ua_webiste' } },
      ],
    },
  });

  if (existing) {
    const updated = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
    console.log(`✅ Updated existing project: ${updated.title}`);
  } else {
    const created = await prisma.project.create({
      data: projectData,
    });
    console.log(`✨ Created new project: ${created.title}`);
  }

  const allProjects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, title: true, githubUrl: true, liveDemoUrl: true, category: true },
  });

  console.log('\n📁 All Active Projects in Neon DB:');
  allProjects.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.title} | GitHub: ${p.githubUrl || 'N/A'} | Live: ${p.liveDemoUrl || 'N/A'}`);
  });
}

main()
  .catch((err) => {
    console.error('❌ Failed to seed UA project:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
