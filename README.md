# Mhatre Traders - Premium B2B Building Materials Platform

This is the codebase for **Mhatre Traders**, a leading supplier of building materials and hardware based in **Chaul, Alibaug**. 

The project features a premium, editorial, and architectural design language utilizing high-quality typography, generous whitespace, warm ivory backgrounds, and terracotta accents.

## Project Structure

```
Mhatre-Traders/
├── client/          # React 19 + Vite + Tailwind CSS v4 Frontend
└── server/          # Node.js + Express + Prisma + PostgreSQL (Future Phase)
```

## Technology Stack (Frontend)
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4, Framer Motion (Animations), Swiper (Carousels)
- **Forms & Alerts**: React Hook Form, React Hot Toast
- **Icons & Counters**: React Icons, React CountUp

## Setup & Running the Frontend

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5173`.

### Production Build
To check for compiler warnings and generate optimized production files:
```bash
npm run build
```
