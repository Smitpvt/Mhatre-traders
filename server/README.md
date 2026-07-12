# Mhatre Traders Backend Foundation

This directory houses the production-ready backend engine for the **Mhatre Traders** application, built using Node.js, Express, and Prisma ORM.

---

## Key Features

1. **Strict Environment Validation**: Utilizes `zod` schema constraints to check environment configuration variables at boot time. Missing key/value properties trigger exit code `1` immediately to prevent silent runtime failures.
2. **Dynamic Whitelist CORS**: Automatically parses the `CLIENT_URLS` environment variable (comma-separated origins) to validate and lock CORS boundaries dynamically.
3. **Structured Speed Logging**: Pino and `pino-http` logging pipelines format logs as fast JSON structures in production (ideal for container streams) and colorized pretty output in development.
4. **Standardized Responses**: Standardized JSON layouts for success and error transactions:
   - **Success**: `{ success: true, message: "...", data: { ... } }`
   - **Error**: `{ success: false, message: "...", errors: [ ... ] }`
5. **Database Safety Controls**: Safe seeding script blueprints check database states and abort on non-empty tables or production environments. Bulk deletes (`deleteMany()`) are banned.
6. **Prisma Migrations Policy**: Strict configuration requiring all schema modifications to proceed through local migrations (`npx prisma migrate dev`), keeping Supabase schemas in sync safely.

---

## Folder Structure

```
server/
├── prisma/
│   ├── migrations/          # Schema migration history
│   └── schema.prisma        # Database connection & structure configuration
├── src/
│   ├── config/              # Centralized environment & API client configurations
│   ├── controllers/         # Requests handler layer (Phase 2)
│   ├── middlewares/         # Global request gates (rate limiter, logger, error, auth)
│   ├── routes/              # Modular versioned routing tables
│   ├── services/            # Core business logic processing (Phase 2)
│   ├── repositories/        # Database interface queries (Phase 2)
│   ├── validators/          # Schemas for request schema parsing
│   ├── utils/               # Custom response formatters and helpers
│   ├── lib/                 # Core wrapper instances (Prisma Client singleton)
│   ├── app.js               # Pipeline orchestration setup
│   └── server.js            # Boot script binding the HTTP listener
└── scripts/
    └── seed.js              # Safe manual database seeder
```

---

## Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in the required parameters:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Verify Health Status**:
   Send a `GET` request to:
   `http://localhost:5000/api/v1/health`
