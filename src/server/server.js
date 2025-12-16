const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

// test route
app.get("/", (req, res) => {
  res.send("HealthKey Backend is running.");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
