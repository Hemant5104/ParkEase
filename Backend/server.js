const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true,
  })
);
// Parse JSON bodies; add small safeguard limit to avoid oversized payload issues
app.use(express.json({ limit: "1mb" }));

// Gracefully handle malformed JSON so clients get a clear 400 instead of stack trace
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next(err);
});

app.use("/api/admin", require("./routes/admin"));
app.use("/api/events", require("./routes/eventroute"));

app.get("/", (req, res) => {
  res.send("Server is running! API available at /api");
});

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const slotRoutes = require("./routes/slotroutes");
const bookingRoutes = require("./routes/booking");
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/admin", authRoutes);

const mongoose = require("mongoose");

// Connect to MongoDB
if (process.env.MONGO_URI) {
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
} else {
  console.error("MONGO_URI is not defined in .env file");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// const express = require("express");
// require("dotenv").config();
 
// const app = express();
 
// app.use(express.json());
 
// // Test Route
// app.get("/", (req, res) => {
//   res.send("Server running successfully 🚀");
// });
 
// const PORT = process.env.PORT || 5000;
 
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });