const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://wittywander.onrender.com"]
    : ["http://localhost:5173", "https://wittywander.onrender.com"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/places", require("./routes/placeRoutes"));

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
