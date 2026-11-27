import { useState } from 'react';

// Official brand colors & local SVG paths
export const TECH_METADATA = {
  html: {
    color: '#E34F26',
    bg: 'rgba(227, 79, 38, 0.12)',
    border: 'rgba(227, 79, 38, 0.35)',
    logo: '/tech-logos/html.svg',
    defaultDesc: 'Semantic markup, modern HTML5 elements, accessibility & web standards',
  },
  css: {
    color: '#1572B6',
    bg: 'rgba(21, 114, 182, 0.12)',
    border: 'rgba(21, 114, 182, 0.35)',
    logo: '/tech-logos/css.svg',
    defaultDesc: 'Responsive styling, Flexbox, CSS Grid systems & modern UI animations',
  },
  javascript: {
    color: '#F7DF1E',
    bg: 'rgba(247, 223, 30, 0.12)',
    border: 'rgba(247, 223, 30, 0.35)',
    logo: '/tech-logos/javascript.svg',
    defaultDesc: 'ES6+ syntax, asynchronous programming, DOM scripting & REST APIs',
  },
  js: {
    color: '#F7DF1E',
    bg: 'rgba(247, 223, 30, 0.12)',
    border: 'rgba(247, 223, 30, 0.35)',
    logo: '/tech-logos/javascript.svg',
    defaultDesc: 'Full-stack client and runtime logic across modern web applications',
  },
  react: {
    color: '#61DAFB',
    bg: 'rgba(97, 218, 251, 0.12)',
    border: 'rgba(97, 218, 251, 0.35)',
    logo: '/tech-logos/react.svg',
    defaultDesc: 'Component architecture, custom Hooks, State management & SPAs',
  },
  reactjs: {
    color: '#61DAFB',
    bg: 'rgba(97, 218, 251, 0.12)',
    border: 'rgba(97, 218, 251, 0.35)',
    logo: '/tech-logos/react.svg',
    defaultDesc: 'Component architecture, custom Hooks, State management & SPAs',
  },
  bootstrap: {
    color: '#7952B3',
    bg: 'rgba(121, 82, 179, 0.12)',
    border: 'rgba(121, 82, 179, 0.35)',
    logo: '/tech-logos/bootstrap.svg',
    defaultDesc: 'Mobile-first responsive CSS framework & rapid UI prototyping',
  },
  tailwind: {
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.35)',
    logo: '/tech-logos/tailwind.svg',
    defaultDesc: 'Utility-first modern CSS framework for custom responsive interfaces',
  },
  'tailwind css': {
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.35)',
    logo: '/tech-logos/tailwind.svg',
    defaultDesc: 'Utility-first modern CSS framework for custom responsive interfaces',
  },
  'node.js': {
    color: '#339933',
    bg: 'rgba(51, 153, 51, 0.12)',
    border: 'rgba(51, 153, 51, 0.35)',
    logo: '/tech-logos/nodejs.svg',
    defaultDesc: 'Event-driven JavaScript runtime, server REST APIs & microservices',
  },
  nodejs: {
    color: '#339933',
    bg: 'rgba(51, 153, 51, 0.12)',
    border: 'rgba(51, 153, 51, 0.35)',
    logo: '/tech-logos/nodejs.svg',
    defaultDesc: 'Event-driven JavaScript runtime, server REST APIs & microservices',
  },
  node: {
    color: '#339933',
    bg: 'rgba(51, 153, 51, 0.12)',
    border: 'rgba(51, 153, 51, 0.35)',
    logo: '/tech-logos/nodejs.svg',
    defaultDesc: 'Event-driven JavaScript runtime, server REST APIs & microservices',
  },
  php: {
    color: '#777BB4',
    bg: 'rgba(119, 123, 180, 0.12)',
    border: 'rgba(119, 123, 180, 0.35)',
    logo: '/tech-logos/php.svg',
    defaultDesc: 'Server-side backend scripting, OOP logic, session handling & SQL',
  },
  express: {
    color: '#FFFFFF',
    bg: 'rgba(255, 255, 255, 0.10)',
    border: 'rgba(255, 255, 255, 0.30)',
    logo: '/tech-logos/express.svg',
    defaultDesc: 'Fast, unopinionated, minimalist web framework for Node.js',
  },
  'express.js': {
    color: '#FFFFFF',
    bg: 'rgba(255, 255, 255, 0.10)',
    border: 'rgba(255, 255, 255, 0.30)',
    logo: '/tech-logos/express.svg',
    defaultDesc: 'Fast, unopinionated, minimalist web framework for Node.js',
  },
  mysql: {
    color: '#4479A1',
    bg: 'rgba(68, 121, 161, 0.12)',
    border: 'rgba(68, 121, 161, 0.35)',
    logo: '/tech-logos/mysql.svg',
    defaultDesc: 'Relational database modeling, complex SQL queries & normalization',
  },
  'neon postgresql': {
    color: '#4169E1',
    bg: 'rgba(65, 105, 225, 0.12)',
    border: 'rgba(65, 105, 225, 0.35)',
    logo: '/tech-logos/postgresql.svg',
    defaultDesc: 'Cloud serverless PostgreSQL, relational schemas, connection pooling & Prisma',
  },
  postgresql: {
    color: '#4169E1',
    bg: 'rgba(65, 105, 225, 0.12)',
    border: 'rgba(65, 105, 225, 0.35)',
    logo: '/tech-logos/postgresql.svg',
    defaultDesc: 'Enterprise relational database, JSONB query capabilities & ACID safety',
  },
  postgres: {
    color: '#4169E1',
    bg: 'rgba(65, 105, 225, 0.12)',
    border: 'rgba(65, 105, 225, 0.35)',
    logo: '/tech-logos/postgresql.svg',
    defaultDesc: 'Enterprise relational database, JSONB query capabilities & ACID safety',
  },
  mongodb: {
    color: '#47A248',
    bg: 'rgba(71, 162, 72, 0.12)',
    border: 'rgba(71, 162, 72, 0.35)',
    logo: '/tech-logos/mongodb.svg',
    defaultDesc: 'NoSQL document store, dynamic JSON collections & aggregation pipelines',
  },
  sqlite: {
    color: '#00A9E0',
    bg: 'rgba(0, 169, 224, 0.12)',
    border: 'rgba(0, 169, 224, 0.35)',
    logo: '/tech-logos/sqlite.svg',
    defaultDesc: 'Self-contained, serverless, zero-configuration SQL database engine',
  },
  xampp: {
    color: '#FB7A24',
    bg: 'rgba(251, 122, 36, 0.12)',
    border: 'rgba(251, 122, 36, 0.35)',
    logo: '/tech-logos/xampp.svg',
    defaultDesc: 'Local development environment package with Apache, MySQL, PHP & Perl',
  },
  mongo: {
    color: '#47A248',
    bg: 'rgba(71, 162, 72, 0.12)',
    border: 'rgba(71, 162, 72, 0.35)',
    logo: '/tech-logos/mongodb.svg',
    defaultDesc: 'NoSQL document store, dynamic JSON collections & aggregation pipelines',
  },
  github: {
    color: '#F0F6FC',
    bg: 'rgba(240, 246, 252, 0.10)',
    border: 'rgba(240, 246, 252, 0.30)',
    logo: '/tech-logos/github.svg',
    defaultDesc: 'Git version control, collaborative repositories, CI/CD & code reviews',
  },
  git: {
    color: '#F05032',
    bg: 'rgba(240, 80, 50, 0.12)',
    border: 'rgba(240, 80, 50, 0.35)',
    logo: '/tech-logos/github.svg',
    defaultDesc: 'Distributed version control, branch management & history tracking',
  },
  vercel: {
    color: '#FFFFFF',
    bg: 'rgba(255, 255, 255, 0.10)',
    border: 'rgba(255, 255, 255, 0.30)',
    logo: '/tech-logos/vercel.svg',
    defaultDesc: 'Cloud frontend deployment, continuous deployment & edge global hosting',
  },
  render: {
    color: '#46E3B7',
    bg: 'rgba(70, 227, 183, 0.12)',
    border: 'rgba(70, 227, 183, 0.35)',
    logo: '/tech-logos/render.svg',
    defaultDesc: 'Cloud hosting platform for web services, backend APIs & PostgreSQL',
  },
};

export function getTechInfo(name = '') {
  const key = name.toLowerCase().trim();
  if (TECH_METADATA[key]) return TECH_METADATA[key];

  // Partial matches
  for (const [k, meta] of Object.entries(TECH_METADATA)) {
    if (key.includes(k) || k.includes(key)) return meta;
  }

  // Generic fallback
  return {
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.35)',
    logo: null,
    defaultDesc: 'Core technical development tool for building software solutions',
  };
}

export default function TechLogo({ name = '', logoUrl = null, className = 'w-10 h-10', onDarkSurface = false }) {
  const meta = getTechInfo(name);
  const [imgSrc, setImgSrc] = useState(logoUrl || meta.logo);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (meta.logo && imgSrc !== meta.logo) {
      setImgSrc(meta.logo);
    } else {
      setHasError(true);
    }
  };

  const isWhiteMonochrome = ['github', 'vercel', 'express', 'next', 'cursor'].some(
    (k) => name.toLowerCase().includes(k)
  );

  if (!hasError && imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={name}
        className={`${className} object-contain transition-transform duration-300 ${
          onDarkSurface
            ? 'drop-shadow-[0_1px_4px_rgba(255,255,255,0.15)]'
            : isWhiteMonochrome
            ? 'tech-monochrome-adapt drop-shadow'
            : 'drop-shadow'
        }`}
        onError={handleError}
        loading="lazy"
      />
    );
  }

  // Monogram badge if no image available
  return (
    <div
      className={`${className} rounded-lg flex items-center justify-center font-bold text-sm tracking-wide ${
        isWhiteMonochrome
          ? onDarkSurface
            ? 'text-white bg-white/10 border border-white/25'
            : 'text-slate-900 dark:text-white bg-slate-200/80 dark:bg-white/10 border border-slate-300 dark:border-white/25'
          : ''
      }`}
      style={
        isWhiteMonochrome
          ? undefined
          : {
              backgroundColor: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.border}`,
            }
      }
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
