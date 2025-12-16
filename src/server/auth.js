const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  message: { error: "too_many_requests", message: "Too many attempts." },
});

function makeToken(user) {
  return jwt.sign(
    { uid: user._id, role: user.role },
    process.env.JWT_SECRET || "devsecret",
    { expiresIn: "8h" }
  );
}

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "invalid", message: "Missing fields" });

  const user = await User.findOne({ email }).exec();
  if (!user)
    return res.status(404).json({ error: "not_registered", message: "User not registered" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match)
    return res.status(401).json({ error: "wrong_password", message: "Wrong password" });

  const token = makeToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;
