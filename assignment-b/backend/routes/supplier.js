const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");

// POST /supplier — Create a new supplier
router.post("/", async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({ error: "Both 'name' and 'city' are required." });
    }

    const supplier = new Supplier({ name: name.trim(), city: city.trim() });
    await supplier.save();

    return res.status(201).json({
      message: "Supplier created successfully.",
      supplier,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /supplier — List all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return res.json({ total: suppliers.length, suppliers });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
