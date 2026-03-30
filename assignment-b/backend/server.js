require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const supplierRoutes = require("./routes/supplier");
const inventoryRoutes = require("./routes/inventory");

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zeerostock";

app.use(cors());
app.use(express.json());

// Routes
app.use("/supplier", supplierRoutes);
app.use("/inventory", inventoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Zeerostock DB API is running.", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

// Connect to MongoDB then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected:", MONGO_URI);
    app.listen(PORT, () => {
      console.log(`✅ Assignment B backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
