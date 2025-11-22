const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoute");
const adminRoutes = require("./routes/adminRoute");
const courseRoutes = require("./routes/courseRoute");
const noticeRoutes = require("./routes/noticeRoute");
const errorHandler = require("./middlewares/error");

const app = express();
connectDB();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
