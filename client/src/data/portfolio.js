export const PROFILE = {
  fullName: 'Jeryll Anne Bides',
  professionalTitle: 'Information Technology Student | Aspiring Web Developer',
  introduction: 'Welcome to my portfolio',
  tagline: 'Passionate about building great software',
  profileImageUrl: '/profile.jpg',
  resumeUrl: null,
  email: 'jeryllanne88@gmail.com',
  phone: '09569142158',
  location: 'Poblacion, Lagangilang Abra',
};

export const ABOUT = {
  biography: `I am a fourth-year Bachelor of Science in Information Technology student with a strong interest in creating websites and mobile applications. I enjoy turning ideas into practical digital experiences by combining creativity, problem-solving, and technical skills.

I am always eager to explore new technologies, experiment with different development tools, and challenge myself through hands-on projects. My goal is to continuously improve my skills and create applications that are useful, accessible, and meaningful to users.`,
  interests: '',
  careerGoals: '',
};

export const SOCIAL_LINKS = [];

export const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    order: 1,
    skills: [
      {
        id: 'html',
        name: 'HTML',
        description: 'Semantic markup, modern HTML5 elements, web accessibility & page hierarchy',
        logoUrl: '/tech-logos/html.svg',
        proficiency: 'Advanced',
        order: 1,
      },
      {
        id: 'css',
        name: 'CSS',
        description: 'Modern responsive styling, Flexbox, Grid systems & fluid UI animations',
        logoUrl: '/tech-logos/css.svg',
        proficiency: 'Advanced',
        order: 2,
      },
      {
        id: 'javascript-fe',
        name: 'JavaScript',
        description: 'ES6+ syntax, asynchronous programming, DOM manipulation & web APIs',
        logoUrl: '/tech-logos/javascript.svg',
        proficiency: 'Proficient',
        order: 3,
      },
      {
        id: 'reactjs',
        name: 'ReactJS',
        description: 'Component architecture, custom Hooks, State management & reactive SPAs',
        logoUrl: '/tech-logos/react.svg',
        proficiency: 'Proficient',
        order: 4,
      },
      {
        id: 'bootstrap',
        name: 'Bootstrap',
        description: 'Mobile-first responsive grid system, utility classes & UI components',
        logoUrl: '/tech-logos/bootstrap.svg',
        proficiency: 'Advanced',
        order: 5,
      },
      {
        id: 'tailwind',
        name: 'Tailwind CSS',
        description: '',
        logoUrl: '/tech-logos/tailwind-custom.webp',
        proficiency: 'Proficient',
        order: 15,
      },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Development',
    order: 2,
    skills: [
      {
        id: 'nodejs',
        name: 'Node.js',
        description: 'Asynchronous event-driven JavaScript runtime, server routing & REST APIs',
        logoUrl: '/tech-logos/nodejs.svg',
        proficiency: 'Proficient',
        order: 1,
      },
      {
        id: 'php',
        name: 'PHP',
        description: 'Server-side application logic, OOP design, session state & database scripting',
        logoUrl: '/tech-logos/php.svg',
        proficiency: 'Intermediate',
        order: 2,
      },
      {
        id: 'javascript-be',
        name: 'JavaScript',
        description: 'Full-stack server runtime logic, Express.js middleware & microservices',
        logoUrl: '/tech-logos/javascript.svg',
        proficiency: 'Proficient',
        order: 3,
      },
    ],
  },
  {
    id: 'database',
    name: 'Database Management',
    order: 3,
    skills: [
      {
        id: 'mysql',
        name: 'MySQL',
        description: 'Relational database schema modeling, SQL query optimization & indexing',
        logoUrl: '/tech-logos/mysql-custom.jpg',
        proficiency: 'Proficient',
        order: 1,
      },
      {
        id: 'neon-postgresql',
        name: 'Neon PostgreSQL',
        description: 'Cloud serverless PostgreSQL, relational schemas, connection pooling & Prisma',
        logoUrl: '/tech-logos/postgresql.svg',
        proficiency: 'Proficient',
        order: 2,
      },
      {
        id: 'mongodb',
        name: 'MongoDB',
        description: 'NoSQL document store, dynamic JSON collections & aggregation pipelines',
        logoUrl: '/tech-logos/mongodb.svg',
        proficiency: 'Intermediate',
        order: 3,
      },
    ],
  },
  {
    id: 'tools',
    name: 'Other Tools & Platforms',
    order: 4,
    skills: [
      {
        id: 'github',
        name: 'GitHub',
        description: 'Git version control, code collaboration, pull requests & repositories',
        logoUrl: '/tech-logos/github.svg',
        proficiency: 'Advanced',
        order: 1,
      },
      {
        id: 'vercel',
        name: 'Vercel',
        description: 'Serverless frontend deployment, edge performance & automated CI/CD',
        logoUrl: '/tech-logos/vercel.svg',
        proficiency: 'Proficient',
        order: 2,
      },
      {
        id: 'render',
        name: 'Render',
        description: 'Cloud hosting platform for web applications, REST backend services & databases',
        logoUrl: '/tech-logos/render-custom.png',
        proficiency: 'Intermediate',
        order: 3,
      },
    ],
  },
];

export const PROJECTS = [
  {
    id: 'employee-info-system',
    title: 'Employee Information & Payroll Management System',
    shortDesc:
      'A comprehensive web-based HR and employee management platform featuring employee service records, automated payroll computation, attendance tracking, and leave management.',
    fullDesc:
      'A full-featured Employee Information and Payroll Management System designed to streamline human resource workflows and administrative operations. The platform manages complete employee profiles, tracks attendance, calculates payroll with deductions and allowances, processes leave applications, and records professional trainings and service histories.\n\nBuilt with a modular Python/Flask backend and a responsive Bootstrap-powered frontend, it interfaces seamlessly with a relational MySQL database to ensure data integrity, role-based access control, and real-time administrative reporting.',
    objectives:
      '• Digitize employee master files, service records, and employment history in a centralized database.\n• Automate payroll calculations, including tax deductions, allowances, and net pay generation.\n• Provide an intuitive attendance tracking and leave management portal for staff and administrators.\n• Enhance organizational efficiency by reducing manual paperwork and improving HR reporting.',
    features:
      '• Employee Profile Management: Add, edit, archive, and view comprehensive staff records and service history.\n• Attendance & Leave Tracking: Monitor daily attendance logs and process leave requests with approval workflows.\n• Automated Payroll System: Calculate gross pay, statutory deductions, net salaries, and generate payslips.\n• Performance & Training Records: Track employee performance evaluations, certifications, and skills workshops.\n• Role-Based Access Control: Secure authentication and administrative access management.',
    category: 'Web Development',
    technologies: 'Python, Flask, MySQL, JavaScript, HTML5, CSS3, Bootstrap, REST API, Git',
    role: 'Full-Stack Developer',
    githubUrl: 'https://github.com/jeryll88/employee-info-system',
    liveDemoUrl: null,
    thumbnailUrl: '/employee-info-system.png',
    status: 'Completed',
    isFeatured: true,
    order: 1,
    images: [],
  },
  {
    id: 'school-lms',
    title: 'School Library Management System (LMS)',
    shortDesc:
      'A web-based library circulation & inventory management platform for tracking book copies, student borrowings, reservations, and real-time analytics.',
    fullDesc:
      'A full-stack School Library Management System designed to streamline campus library circulation, cataloging, and student borrowing workflows. Built to replace manual record-keeping, it features role-based access for librarians and students, automated copy inventory tracking, book reservation queues, overdue monitoring, and rich administrative reports.',
    objectives:
      '• Automate book cataloging, barcode/copy tracking, and category classification.\n• Provide a student and staff portal for book discovery, borrowing, and reservation queues.\n• Deliver real-time analytics on library inventory, overdue loans, and popular reading materials.\n• Streamline circulation operations with automated due date tracking.',
    features:
      '• Role-Based Authentication & Permissions (Librarians, Staff, Student Borrowers)\n• Live Book Catalog & Multi-Copy Inventory Management\n• Circulation Module: Real-time Checkouts, Returns, and Fine/Overdue Tracking\n• Book Reservation Queue System\n• Course-Aligned Categorization & Fast Title Searching\n• Analytics Dashboard: Popular Books, Inventory Health, and Circulation Statistics\n• Automated Due Date Notifications\n• Deployed live on Vercel with responsive cloud architecture',
    category: 'Web Development',
    technologies: 'React.js, Node.js, Express.js, PostgreSQL, Prisma, REST API, Tailwind CSS, Vercel',
    role: 'Full-Stack Developer (Architecture, Database Modeling, REST API & Frontend UI)',
    githubUrl: null,
    liveDemoUrl: 'https://lms-mu-fawn.vercel.app/',
    thumbnailUrl: '/projects/lms-thumb.png',
    status: 'Completed',
    isFeatured: true,
    order: 2,
    images: [],
  },
  {
    id: 'ua-web-portal',
    title: 'University of Abra (UA) Web Portal & Campus CMS',
    shortDesc:
      'An institutional web portal and content management system for the University of Abra, featuring academic program catalogs, admissions, student services, and administrative publishing.',
    fullDesc:
      'A modular full-stack web application engineered for the University of Abra (UA). The platform serves as the primary digital gateway for prospective applicants, enrolled students, faculty, and university administration. Built with a clean PHP architecture, it delivers dynamic content rendering, college academic directories, admission procedures, campus clearance workflows, and an authenticated administrative back-office for publishing news, university memorandums, and student announcements.',
    objectives:
      '• Build a modern, responsive institutional web portal for University of Abra students, alumni, and prospective applicants.\n• Deliver a secure back-office administrative CMS for publishing official campus news, events, and academic updates.\n• Streamline student service discovery, program curriculums, and admission requirements.\n• Implement clean, lightweight server-side routing with PHP PDO database integration.',
    features:
      '• Modular PHP MVC Architecture & Lightweight Server Router\n• Comprehensive College Directories, Degree Offerings & Academic Curriculums\n• Online Admissions Portal & Student Services Guidelines\n• Administrative CMS for News, Events & Institutional Announcements\n• Database Abstraction via PHP Data Objects (PDO) for MySQL and SQLite\n• Mobile-First Responsive Design with Dark Mode Support\n• Clean URL Rewriting with Apache .htaccess and router.php\n• Open-Source GitHub Repository for Academic Collaboration',
    category: 'Web Development',
    technologies: 'PHP, MySQL, SQLite, JavaScript, HTML5, CSS3, Apache, Git',
    role: 'Full-Stack Developer (PHP Architecture, Database Design, Routing & Front-End UI)',
    githubUrl: 'https://github.com/jeryll88/ua_webiste',
    liveDemoUrl: null,
    thumbnailUrl: '/projects/ua-thumb.png',
    status: 'Completed',
    isFeatured: true,
    order: 3,
    images: [],
  },
];

export const AWARDS = [
  {
    id: 'best-pitch-2026',
    title: 'Best Pitch Award — Pitching Competition',
    organization: 'College of Mathematics and Computing Sciences (CMCS) & ICTSO, ASIST (University of Abra)',
    dateReceived: 'March 16, 2026',
    description:
      'Awarded for receiving the Best Pitch Award during the Pitching Competition at the 1st CMCS Days Celebration, in recognition of delivering the most outstanding and innovative idea through an excellent and compelling presentation.',
    imageUrl: '/certificates/best_pitching.jpg',
    verificationLink: null,
    order: 1,
  },
  {
    id: 'deans-lister-25-26',
    title: "Dean's Lister — First Semester A.Y. 2025–2026",
    organization: 'College of Mathematics and Computing Sciences, Department of Information Technology — ASIST',
    dateReceived: 'March 12, 2026',
    description:
      "Certificate of Recognition awarded to Jeryll Anne T. Bides for academic excellence as a Dean's Lister during the First Semester of Academic Year 2025 & 2026.",
    imageUrl: '/certificates/dl_25-26.jpg',
    verificationLink: null,
    order: 2,
  },
  {
    id: 'deans-lister-24-25',
    title: "Dean's Lister — First Semester A.Y. 2024–2025",
    organization: 'College of Arts and Sciences, Department of Information Technology — ASIST',
    dateReceived: 'June 10, 2025',
    description:
      "Certificate of Recognition awarded to Jeryll Anne T. Bides for academic excellence as a Dean's Lister during the First Semester of Academic Year 2024 & 2025.",
    imageUrl: '/certificates/dl_sy_24-25.jpg',
    verificationLink: null,
    order: 3,
  },
  {
    id: 'netacad-os-basics',
    title: 'Operating Systems Basics',
    organization: 'Cisco Networking Academy & DICT-ITU DTC Initiative',
    dateReceived: 'January 24, 2026',
    description:
      'Certificate of Completion awarded for successfully completing Operating Systems Basics offered by DICT-ITU DTC Initiative through the Cisco Networking Academy program.',
    imageUrl: '/certificates/netacad.pdf',
    verificationLink: 'https://www.netacad.com',
    order: 4,
  },
  {
    id: 'pitching-finalist-2026',
    title: 'Pitching Competition Finalist & Participant',
    organization: 'College of Mathematics and Computing Sciences (CMCS), ASIST',
    dateReceived: 'March 12, 2026',
    description:
      'Certificate of Participation for actively participating in the Pitching Competition during the 1st CMCS Days Celebration, demonstrating creativity, confidence, and excellence in presenting innovative ideas.',
    imageUrl: '/certificates/pitching.jpg',
    verificationLink: null,
    order: 5,
  },
  {
    id: 'yep-marites-2026',
    title: 'YEP! You Can Be Your Own Boss Training-Workshop',
    organization: 'Department of Trade and Industry (DTI-CAR) & CHED-CAR',
    dateReceived: 'September 4, 2026',
    description:
      'Certificate of Completion for completing the YEP! You Can Be Your Own Boss Training-Workshop under Project MARITES (Youth Entrepreneurship Program) held at The Orchard Hotel, Baguio City.',
    imageUrl: '/certificates/yepmarites.jpg',
    verificationLink: null,
    order: 6,
  },
];

export const SITE_SETTINGS = {
  siteTitle: 'Jeryll Anne Bides | IT Portfolio',
  footerText: '© 2026 Jeryll Anne Bides. Built with React and Tailwind CSS.',
};
