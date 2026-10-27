# InstaLite — Express + Prisma Backend

InstaLite is a mini Instagram-style backend API built using Node.js, Express, and Prisma ORM with SQLite, following the MVC (Model-View-Controller) architectural pattern.

## Features

- **Express Server**: RESTful architecture with JSON middleware, health check, and error handling.
- **User Management**: Full CRUD operations with unique constraints, validation, and privacy filtering.
- **Post Management**: Full CRUD operations linked to authors, location filtering, and full-text search.
- **Relations & Likes**: Explicit many-to-many relationship (`Like`) connecting `User` and `Post` with composite primary keys and cascade deletion.
- **Query Capabilities**: Pagination (`page`, `limit`), sorting (`sortBy`, `order`), and filtering.
- **Database Seeding**: Reliable seed script maintaining relational integrity across users, posts, and likes.

## Project Structure

```
├── .env.example
├── .gitignore
├── package.json
├── prisma7.config.js
├── prisma/
│   ├── schema.prisma
│   ├── seed-data.js
│   └── seed.js
├── src/
│   ├── app.js
│   ├── index.js
│   ├── db.js
│   ├── controllers/
│   │   ├── users.controller.js
│   │   ├── posts.controller.js
│   │   └── likes.controller.js
│   ├── routes/
│   │   ├── users.routes.js
│   │   └── posts.routes.js
│   ├── services/
│   │   ├── users.service.js
│   │   ├── posts.service.js
│   │   └── likes.service.js
│   └── utils/
│       └── pagination.js
├── tests/
│   └── api.test.js
└── README.md
```

## Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Default configuration uses SQLite:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

### 3. Apply Migrations & Generate Prisma Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Server
```bash
npm start
```
Server starts on port `3000`:
```
Server started on port 3000
```
