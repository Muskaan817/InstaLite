const express = require("express");
const router = express.Router();
const prisma = require("../db");

// POST /users - Create a user
router.post("/", async (req, res) => {
  try {
    const { username, email, fullname, bio } = req.body || {};

    if (
      !username ||
      !email ||
      !fullname ||
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof fullname !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !fullname.trim()
    ) {
      return res.status(400).json({ error: "username, email and fullname are required" });
    }

    const userData = {
      username: username.trim(),
      email: email.trim(),
      fullname: fullname.trim(),
    };

    if (bio !== undefined) {
      userData.bio = bio;
    }

    const createdUser = await prisma.user.create({
      data: userData,
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users - List all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users/:id - Get one user
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /users/:id - Update user
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {};
    if (req.body.fullname !== undefined) updateData.fullname = req.body.fullname;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.isPrivate !== undefined) {
      if (typeof req.body.isPrivate === "boolean") {
        updateData.isPrivate = req.body.isPrivate;
      } else if (req.body.isPrivate === "true" || req.body.isPrivate === "false") {
        updateData.isPrivate = req.body.isPrivate === "true";
      } else {
        return res.status(400).json({ error: "isPrivate must be true or false" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
