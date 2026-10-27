const prisma = require("../src/db");
const { users, posts, likes } = require("./seed-data");

async function main() {
  // 1. Delete all rows from tables in safe dependency order (children first)
  await prisma.like.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create users and retrieve created records to map actual IDs
  const createdUsers = [];
  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        fullname: u.fullname,
        bio: u.bio,
        isPrivate: u.isPrivate,
        createdAt: new Date(u.createdAt),
      },
    });
    createdUsers.push(user);
  }

  // 3. Build lookup: username -> id
  const userMap = new Map();
  for (const user of createdUsers) {
    userMap.set(user.username, user.id);
  }

  // 4. Create all posts using resolved authorId
  const createdPosts = [];
  for (const p of posts) {
    const authorId = userMap.get(p.author);
    const post = await prisma.post.create({
      data: {
        imageUrl: p.imageUrl,
        caption: p.caption,
        location: p.location,
        createdAt: new Date(p.createdAt),
        authorId,
      },
    });
    createdPosts.push(post);
  }

  // 5. Build lookup: insta## key -> post.id
  const postMap = new Map();
  for (const post of createdPosts) {
    const match = post.imageUrl.match(/insta\d+/);
    if (match) {
      postMap.set(match[0], post.id);
    }
  }

  // 6. Create all likes using resolved userId and postId
  const createdLikes = [];
  for (const l of likes) {
    const userId = userMap.get(l.user);
    const postId = postMap.get(l.post);
    if (userId && postId) {
      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      createdLikes.push(like);
    }
  }

  // 7. Print summary of seeded records
  console.log(
    `🌱 Seeded ${createdUsers.length} users, ${createdPosts.length} posts and ${createdLikes.length} likes`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
