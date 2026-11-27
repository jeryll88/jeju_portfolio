-- ============================================================
-- INTERACTIVE IT PORTFOLIO DATABASE SCHEMA (PostgreSQL / Neon)
-- ============================================================

-- Create isolated portfolio schema
CREATE SCHEMA IF NOT EXISTS "portfolio";
SET search_path TO "portfolio", public;

-- Enable pgcrypto for UUID/ID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profile Table
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "fullName" TEXT NOT NULL DEFAULT 'Your Name',
    "professionalTitle" TEXT NOT NULL DEFAULT 'Information Technology Student',
    "introduction" TEXT NOT NULL DEFAULT 'Welcome to my portfolio',
    "tagline" TEXT NOT NULL DEFAULT '',
    "profileImageUrl" TEXT,
    "profileImageId" TEXT,
    "resumeUrl" TEXT,
    "resumeId" TEXT,
    "email" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Social Links Table
CREATE TABLE IF NOT EXISTS "social_links" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. About Table
CREATE TABLE IF NOT EXISTS "about" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "biography" TEXT NOT NULL DEFAULT '',
    "interests" TEXT NOT NULL DEFAULT '',
    "careerGoals" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Education Table
CREATE TABLE IF NOT EXISTS "education" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT NOT NULL DEFAULT '',
    "startYear" TEXT NOT NULL,
    "endYear" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Skill Categories Table
CREATE TABLE IF NOT EXISTS "skill_categories" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT UNIQUE NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Skills Table
CREATE TABLE IF NOT EXISTS "skills" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "logoId" TEXT,
    "proficiency" TEXT NOT NULL DEFAULT 'Intermediate',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL REFERENCES "skill_categories"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Projects Table
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL DEFAULT '',
    "fullDesc" TEXT NOT NULL DEFAULT '',
    "objectives" TEXT NOT NULL DEFAULT '',
    "features" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Web Development',
    "technologies" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "githubUrl" TEXT,
    "liveDemoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "thumbnailId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'In Progress',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Project Images Table
CREATE TABLE IF NOT EXISTS "project_images" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "imageUrl" TEXT NOT NULL,
    "imageId" TEXT,
    "caption" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Awards & Certificates Table
CREATE TABLE IF NOT EXISTS "awards" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL DEFAULT '',
    "dateReceived" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "imageId" TEXT,
    "verificationLink" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Contact Messages Table
CREATE TABLE IF NOT EXISTS "contact_messages" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Website Settings Table
CREATE TABLE IF NOT EXISTS "website_settings" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "siteTitle" TEXT NOT NULL DEFAULT 'My Portfolio',
    "footerText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Default Admin User (admin@portfolio.com / AdminPassword123!)
INSERT INTO "admin_users" ("email", "password", "name")
VALUES (
    'admin@portfolio.com',
    '$2a$10$wofmr66l2JFNXrqW7v77qOYyyEhdaXhbFGpmi7GWIuIgBxxsZckAa',
    'Portfolio Owner'
)
ON CONFLICT ("email") DO NOTHING;

-- Default Profile
INSERT INTO "profiles" ("fullName", "professionalTitle", "introduction", "tagline", "email")
SELECT 'Portfolio Owner', 'Information Technology Student | Aspiring Web Developer', 'I am an Information Technology student passionate about web development, database management, and creating innovative digital solutions.', 'Building scalable and interactive web experiences', 'admin@portfolio.com'
WHERE NOT EXISTS (SELECT 1 FROM "profiles");

-- Default About
INSERT INTO "about" ("biography", "interests", "careerGoals")
SELECT 
    'An aspiring Information Technology student passionate about creating modern, responsive, and data-driven web applications.',
    'Full-Stack Web Development, Database Architecture, Cloud Solutions, UI/UX Design',
    'To become a full-stack software engineer and lead innovative tech projects.'
WHERE NOT EXISTS (SELECT 1 FROM "about");

-- Default Website Settings
INSERT INTO "website_settings" ("siteTitle", "footerText")
SELECT 'Portfolio', '© 2025 Portfolio Owner. Built with React, Tailwind CSS, Node.js, and Neon PostgreSQL.'
WHERE NOT EXISTS (SELECT 1 FROM "website_settings");

-- Default Skill Categories
INSERT INTO "skill_categories" ("name", "order") VALUES
    ('Programming Languages', 1),
    ('Frontend Development', 2),
    ('Backend Development', 3),
    ('Database Management', 4),
    ('Development Tools', 5)
ON CONFLICT ("name") DO NOTHING;
