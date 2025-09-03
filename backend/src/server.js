const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors"); // <--- add this

dotenv.config();

// connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000", // allow frontend
  credentials: true, // allow cookies/auth headers if needed
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
