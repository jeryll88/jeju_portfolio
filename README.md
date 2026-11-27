# Interactive Personal IT Portfolio with Private CMS

A modern, fully responsive personal portfolio website with a private Content Management System (CMS) for managing all website content without editing source code.

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | Neon PostgreSQL, Prisma ORM |
| **Image Storage** | Cloudinary |
| **Auth** | JWT, bcryptjs |

## 📁 Project Structure

```
JENGPORTFOLIO/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── admin/            # CMS admin pages & components
│   │   ├── components/       # Shared UI components
│   │   ├── sections/         # Public portfolio sections
│   │   ├── pages/            # Page components
│   │   ├── layouts/          # PublicLayout, AdminLayout
│   │   ├── hooks/            # useAuth context
│   │   ├── services/         # API service (axios)
│   │   └── styles/           # Tailwind CSS
│   └── package.json
├── server/                   # Express backend
│   ├── controllers/          # Route handlers
│   ├── routes/               # Express routes
│   ├── middleware/            # Auth, upload, rate limiting
│   ├── config/               # Database, Cloudinary config
│   ├── utils/                # Cloudinary upload helpers
│   └── prisma/               # Schema & seed
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 8+
- **Neon PostgreSQL** database (free at [neon.tech](https://neon.tech))
- **Cloudinary** account (free at [cloudinary.com](https://cloudinary.com))

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

Then fill in your values:

```env
# Neon PostgreSQL connection string
DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/portfolio?sslmode=require"

# JWT secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"

# Initial admin account
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="YourSecurePassword123!"
ADMIN_NAME="Your Name"
```

### 3. Set Up Database

```bash
cd server

# Run Prisma migration to create tables
npx prisma migrate dev --name init

# Seed the database with initial admin user and defaults
node prisma/seed.js
```

### 4. Start Development Servers

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin CMS:** http://localhost:5173/admin/login

### 5. Log In to CMS

Navigate to `http://localhost:5173/admin/login` and use the credentials from your `.env` file.

## 🌐 Public Portfolio Features

| Section | Description |
|---------|-------------|
| **Hero** | Animated intro with name, title, profile image, resume download, social links |
| **About** | Biography, interests, career goals, education timeline |
| **Skills** | Technology logos organized by category with proficiency badges |
| **Projects** | Filterable project cards with detail modal, screenshots, GitHub/demo links |
| **Awards** | Certificate gallery with image preview modal |
| **Contact** | Working contact form with validation |

**Visual Effects:** Custom cursor, particle background, scroll animations, glassmorphism, smooth transitions.

## 🔐 Admin CMS Features

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | Stats overview, recent activity, quick actions |
| **Profile** | Name, title, intro, profile image, resume, social links |
| **About** | Biography, interests, career goals, education CRUD |
| **Skills** | Skill categories, logo upload, proficiency, publish/unpublish |
| **Projects** | Full CRUD, thumbnail + screenshots, GitHub/demo URLs, featured toggle |
| **Awards** | Certificate image upload, organization, verification links |
| **Messages** | View, read/unread, delete contact form submissions |
| **Settings** | Site title, footer text |

## 📦 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel, set root to `client/`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add env var: `VITE_API_URL=https://your-backend-url.com/api`

### Backend (Render / Railway)

1. Set root directory to `server/`
2. Set build command: `npm install && npx prisma generate`
3. Set start command: `node index.js`
4. Add all environment variables from `.env`
5. Set `CLIENT_URL` to your Vercel frontend URL

### Database (Neon)

Your Neon PostgreSQL database is already cloud-hosted. Just use the connection string in `DATABASE_URL`.

## 🔒 Security

- Server-side JWT authentication on all admin endpoints
- bcryptjs password hashing
- Rate limiting on login (5/15min) and contact form (3/15min)
- File type validation for uploads
- Helmet security headers
- CORS restriction to frontend origin
- httpOnly cookies for token storage
- Prisma ORM protects against SQL injection

## 📝 API Endpoints

All endpoints are under `/api`. Admin endpoints require a valid JWT token.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/login | No | Admin login |
| POST | /auth/logout | No | Clear auth cookie |
| GET | /auth/me | Yes | Get current admin |
| GET | /profile | No | Get profile + social links |
| PUT | /profile | Yes | Update profile |
| GET | /social-links | No | Get visible social links |
| POST/PUT/DELETE | /social-links | Yes | Manage social links |
| GET | /about | No | Get about + education |
| PUT | /about | Yes | Update about info |
| GET/POST/PUT/DELETE | /education | Mix | Manage education |
| GET | /skills | No | Get published skills by category |
| GET | /skills/all | Yes | Get all skills (admin) |
| POST/PUT/DELETE | /skills | Yes | Manage skills |
| GET | /projects | No | Get published projects (filterable) |
| GET | /projects/all | Yes | Get all projects (admin) |
| POST/PUT/DELETE | /projects | Yes | Manage projects |
| GET | /awards | No | Get published awards |
| POST/PUT/DELETE | /awards | Yes | Manage awards |
| POST | /contact | No | Submit contact message |
| GET/PATCH/DELETE | /contact | Yes | Manage messages |
| GET/PUT | /settings | Mix | Website settings |
| GET | /dashboard/stats | Yes | Dashboard statistics |
| GET | /dashboard/recent | Yes | Recent activity |
