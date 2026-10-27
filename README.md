# InstaLite Backend

A simple Instagram-like backend built with Node.js, Express, and Prisma ORM using SQLite.

## Project Structure

This project follows the **MVC (Model-View-Controller)** pattern:

- **Routes (`src/routes/`)**: Defines the API endpoints (URLs) and maps them to controllers.
- **Controllers (`src/controllers/`)**: Handles incoming requests, validates data, and sends back JSON responses.
- **Services (`src/services/`)**: Runs database queries using Prisma.
- **Database Client (`src/db.js`)**: Shared Prisma client connecting to SQLite.
- **Database Schema (`prisma/schema.prisma`)**: Defines the User, Post, and Like tables and relations.

```
InstaLite/
├── prisma/
│   ├── schema.prisma       # Database models
│   ├── seed-data.js        # Initial users, posts, and likes
│   └── seed.js             # Seeding script
├── src/
│   ├── controllers/        # Request handling and validation
│   ├── routes/             # Express routes
│   ├── services/           # Prisma database queries
│   ├── utils/              # Pagination helper
│   ├── app.js              # Express app configuration
│   ├── db.js               # Prisma client singleton
│   └── index.js            # Server entry point
├── tests/
│   └── api.test.js         # Basic test script
├── .env.example
├── package.json
└── README.md
```

---

## How to Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

### 3. Run database migrations & generate Prisma client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Seed the database
```bash
npm run seed
```
This populates the database with 12 users, 24 posts, and 29 likes.

### 5. Start the server
```bash
npm start
```
The server will start on port 3000:
```
Server started on port 3000
```

### 6. Run tests
```bash
npm test
```

---

## API Endpoints Summary

### Health
- `GET /health` — Check server status (returns `200` with `{ "status": "OK" }`).

### Users (`/users`)
- `POST /users` — Create a new user (`username`, `email`, `fullname`).
- `GET /users` — Get all users (supports `?page=1&limit=10`, `?search=...`, `?isPrivate=true`).
- `GET /users/:id` — Get a user by ID.
- `PATCH /users/:id` — Update user details (`fullname`, `bio`, `isPrivate`).
- `DELETE /users/:id` — Delete a user (also deletes their posts and likes).
- `GET /users/:id/posts` — Get all posts created by a user.
- `GET /users/:id/liked-posts` — Get all posts liked by a user.

### Posts (`/posts`)
- `POST /posts` — Create a post (`imageUrl`, `authorId`, `caption`, `location`).
- `GET /posts` — Get all posts (supports `?location=Goa`, `?sortBy=likes`).
- `GET /posts/:id` — Get a post by ID.
- `PATCH /posts/:id` — Update post caption or location.
- `DELETE /posts/:id` — Delete a post (also deletes its likes).
- `GET /posts/:id/likes` — Get the list of users who liked a post.
- `POST /posts/:id/likes` — Like a post (body: `{ "userId": 1 }`).
- `DELETE /posts/:id/likes/:userId` — Unlike a post.

---

## Simple Viva Notes

1. **What is MVC?**
   - **Model**: Database layer (Prisma schema and services).
   - **View**: The JSON response sent back to the client.
   - **Controller**: The middleman that validates the input and returns the right status code.

2. **What are Prisma Relations?**
   - **User to Post (1-to-many)**: One user can have many posts.
   - **User to Post via Like (many-to-many)**: A user can like many posts, and a post can be liked by many users. We use a `Like` table with a composite key `@@id([userId, postId])` to prevent duplicate likes.

3. **What is Cascade Delete?**
   - In `schema.prisma`, `onDelete: Cascade` ensures that if a user is deleted, all their posts and likes are automatically removed so no broken records remain in the database.
