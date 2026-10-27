
const app = require("../src/app");
const prisma = require("../src/db");

const PORT = 3008;
const BASE = `http://localhost:${PORT}`;

async function run() {
  const server = app.listen(PORT, async () => {
    console.log("Running simple API tests...\n");

    try {
      const healthRes = await fetch(`${BASE}/health`);
      const healthData = await healthRes.json();
      console.log("1. GET /health ->", healthRes.status, healthData);

      const userRes = await fetch(`${BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "student1",
          email: "student1@example.com",
          fullname: "Student One",
          bio: "CS student",
        }),
      });
      const user = await userRes.json();
      console.log("2. POST /users ->", userRes.status, "Created user ID:", user.id);


      const listRes = await fetch(`${BASE}/users`);
      const listData = await listRes.json();
      console.log("3. GET /users ->", listRes.status, "Total users:", listData.meta.total);


      const postRes = await fetch(`${BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: "https://picsum.photos/600/600",
          caption: "My first post",
          location: "Campus",
          authorId: user.id,
        }),
      });
      const post = await postRes.json();
      console.log("4. POST /posts ->", postRes.status, "Created post ID:", post.id);

        const likeRes = await fetch(`${BASE}/posts/${post.id}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      console.log("5. POST /posts/:id/likes ->", likeRes.status, "Liked post");


      const getPostRes = await fetch(`${BASE}/posts/${post.id}`);
      const postData = await getPostRes.json();
      console.log("6. GET /posts/:id ->", getPostRes.status, "Author:", postData.author.username, "Likes count:", postData._count.likes);
      const unlikeRes = await fetch(`${BASE}/posts/${post.id}/likes/${user.id}`, {
        method: "DELETE",
      });
      console.log("7. DELETE /posts/:id/likes/:userId ->", unlikeRes.status, "Unliked post");
      const delUserRes = await fetch(`${BASE}/users/${user.id}`, {
        method: "DELETE",
      });
      console.log("8. DELETE /users/:id ->", delUserRes.status, "Deleted user");

      console.log("\n✅ All basic tests completed successfully!");
    } catch (err) {
      console.error("Test failed:", err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}

run();
