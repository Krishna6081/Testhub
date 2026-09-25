# TestHub — Online Test & Practice Platform for Competitive Exams

**Tagline**: *"Practice Smart. Test Yourself. Improve Every Day."*

TestHub is a production-ready, full-stack examination and practice platform designed for competitive-exam preparation (SSC, Banking PO/Clerk, Railways, RRB NTPC, State Exams, etc.).

---

## 🌟 Key Features

- **Exam Sections**: Reasoning Aptitude, Mathematics & Quantitative Aptitude, General Science (Physics, Chemistry, Biology), and General Knowledge (GK & Indian Polity).
- **Test Engine & Simulation**:
  - Countdown timer with automatic submission on expiration.
  - Interactive visual Question Palette (Unvisited, Answered, Not Answered, Marked for Review).
  - Secure server-side answer key validation (answers are never exposed to client side before submission).
  - Negative marking calculation logic (+1.0 / -0.25).
  - Bookmark questions during tests or practice.
- **Detailed Analytics & Results**:
  - Score, percentage, accuracy gauge, and section/topic performance breakdown.
  - Step-by-step solution explanations.
  - Interactive Recharts performance graphs over time.
  - Automatic **Weak Topics** detection.
- **Practice & Special Modes**:
  - **Untimed Practice Mode**: Immediate answer validation and solution explanations.
  - **Daily Test Challenge**: Configured daily practice quiz with streak counter.
- **Global Leaderboard**: Student rankings based on aggregate score and accuracy (Daily, Weekly, Monthly, All-Time).
- **Comprehensive Admin Control Panel**:
  - Manage Sections, Topics, Questions, and Tests.
  - Auto-select questions from Question Bank.
  - Question duplication and bulk JSON/CSV question importer.
  - User Directory and activation/deactivation control.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Redux Toolkit, React Router v6, Axios, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, JWT Authentication, bcryptjs, Helmet, CORS, Express Rate Limit, Zod validation.
- **Database**: PostgreSQL (Compatible with Neon Serverless PostgreSQL).
- **Deployment**:
  - Frontend → **Vercel**
  - Backend → **Render**
  - Database → **Neon PostgreSQL**

---

## 📁 Repository Structure

```
testhub/
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Common, Test, and Analytics UI components
│   │   ├── layouts/         # Main, Dashboard, and Admin Layouts
│   │   ├── pages/           # Public, Student, and Admin pages
│   │   ├── services/        # Axios API clients
│   │   ├── store/           # Redux Toolkit store & slices
│   │   ├── types/           # TypeScript interfaces
│   │   ├── routes/          # App routing definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # REST API business logic
│   │   ├── middleware/      # Auth, Admin authorization, Error handler
│   │   ├── routes/          # Express router mounts
│   │   ├── utils/           # JWT, Bcrypt, Prisma client
│   │   ├── validators/      # Zod validation schemas
│   │   └── server.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL Schema
│   │   └── seed.ts          # Seed script for demo data
│   ├── package.json
│   └── tsconfig.json
│
├── render.yaml              # Render Deployment Configuration
├── vercel.json              # Vercel Deployment Configuration
├── .gitignore
└── README.md
```

---

## 🔑 Demo Credentials (For Development & Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin User** | `admin@testhub.com` | `admin123` |
| **Demo Student** | `user@testhub.com` | `user123` |

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js >= v18.x
- NPM >= 9.x
- PostgreSQL instance (or Neon PostgreSQL database connection string)

### 1. Database Setup (Neon or PostgreSQL)
Create a PostgreSQL database (e.g., `testhub`).

In `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/testhub?schema=public"
JWT_SECRET="testhub_super_secret_jwt_key_2026"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

In `frontend/.env`:
```env
VITE_API_URL="http://localhost:5000/api"
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
# or npx prisma migrate dev
npm run prisma:seed
npm run dev
```
Backend will start on `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:3000`.

---

## 🚀 Deployment Instructions

### Deploy Database to Neon PostgreSQL
1. Sign up at [Neon.tech](https://neon.tech).
2. Create a new PostgreSQL database project named `testhub`.
3. Copy the pooled PostgreSQL Connection String.

### Deploy Backend to Render
1. Sign up at [Render.com](https://render.com).
2. Create a new **Web Service** and connect your GitHub repository.
3. Use the following build settings (or select `render.yaml`):
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Set Environment Variables:
   - `DATABASE_URL`: *(Your Neon Connection String)*
   - `JWT_SECRET`: *(Any secret random string)*
   - `FRONTEND_URL`: *(Your Vercel URL)*

### Deploy Frontend to Vercel
1. Sign up at [Vercel.com](https://vercel.com).
2. Import your GitHub repository.
3. Select `frontend` directory.
4. Set Environment Variables:
   - `VITE_API_URL`: `https://your-render-backend.onrender.com/api`
5. Deploy! Vercel handles single-page app rewrites via `vercel.json`.

---

## 🛡️ Security Best Practices Implemented

- **Answer Key Security**: Correct option flags (`isCorrect`) and solution explanations are **never** returned to the browser during test attempts. They are only fetched server-side upon test submission.
- **Score Validation**: All scores, accuracy %, and negative marking calculations take place strictly on the backend.
- **Password Security**: Passwords hashed using `bcrypt` with salt factor 10.
- **API Security**: Protected routes guarded by JWT tokens, Helmet headers, CORS restrictions, and Rate Limiting.
