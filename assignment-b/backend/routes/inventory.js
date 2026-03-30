const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const Supplier = require("../models/Supplier");

// POST /inventory — Add inventory item
router.post("/", async (req, res) => {
  try {
    const { supplier_id, product_name, quantity, price } = req.body;

    // Required field checks
    if (!supplier_id || !product_name || quantity === undefined || price === undefined) {
      return res.status(400).json({
        error: "Fields required: supplier_id, product_name, quantity, price.",
      });
    }

    // Validate supplier exists
    const supplier = await Supplier.findById(supplier_id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found. Provide a valid supplier_id." });
    }

    // Validate quantity and price
    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity must be >= 0." });
    }
    if (price <= 0) {
      return res.status(400).json({ error: "Price must be > 0." });
    }

    const item = new Inventory({ supplier_id, product_name: product_name.trim(), quantity, price });
    await item.save();

    return res.status(201).json({
      message: "Inventory item added successfully.",
      item,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /inventory — All inventory with optional supplier populate
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find()
      .populate("supplier_id", "name city")
      .sort({ createdAt: -1 });

    return res.json({ total: items.length, items });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /inventory/grouped
 * Returns all inventory grouped by supplier,
 * sorted by total inventory value (quantity × price) descending.
 *
 * MongoDB Aggregation Pipeline:
 * 1. $group  — group by supplier_id, collect items, sum total value
 * 2. $lookup — join with suppliers collection to get name & city
 * 3. $sort   — sort by totalValue descending
 */
router.get("/grouped", async (req, res) => {
  try {
    const grouped = await Inventory.aggregate([
      {
        $group: {
          _id: "$supplier_id",
          items: {
            $push: {
              product_name: "$product_name",
              quantity: "$quantity",
              price: "$price",
              itemValue: { $multiply: ["$quantity", "$price"] },
            },
          },
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
          totalItems: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: "$supplier" },
      { $sort: { totalValue: -1 } },
      {
        $project: {
          _id: 0,
          supplier: { _id: "$supplier._id", name: "$supplier.name", city: "$supplier.city" },
          totalValue: 1,
          totalItems: 1,
          items: 1,
        },
      },
    ]);

    return res.json({ groups: grouped.length, grouped });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
