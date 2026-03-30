const express = require("express");
const cors = require("cors");
const inventory = require("./data");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

/**
 * GET /search
 * Query Params:
 *   q        - product name partial match (case-insensitive)
 *   category - category filter (case-insensitive)
 *   minPrice - minimum price (inclusive)
 *   maxPrice - maximum price (inclusive)
 *
 * Search Logic:
 *   1. Start with full in-memory inventory array.
 *   2. Filter by `q`        → item.name includes q (case-insensitive).
 *   3. Filter by `category` → item.category matches category (case-insensitive).
 *   4. Filter by `minPrice` → item.price >= minPrice (parsed as float).
 *   5. Filter by `maxPrice` → item.price <= maxPrice (parsed as float).
 *   6. All filters are combined (AND logic).
 *   7. No filters → return all records.
 *
 * Edge Cases:
 *   - Empty q        → treated as no name filter.
 *   - minPrice > maxPrice → returns 400 Bad Request.
 *   - No matches     → returns empty array with 200.
 */
app.get("/search", (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  // Validate price range
  if (minPrice !== undefined && maxPrice !== undefined) {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min) && !isNaN(max) && min > max) {
      return res.status(400).json({
        error: "Invalid price range: minPrice cannot be greater than maxPrice.",
      });
    }
  }

  let results = [...inventory];

  // Filter by name (partial, case-insensitive)
  if (q && q.trim() !== "") {
    const query = q.trim().toLowerCase();
    results = results.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }

  // Filter by category (case-insensitive)
  if (category && category.trim() !== "") {
    const cat = category.trim().toLowerCase();
    results = results.filter(
      (item) => item.category.toLowerCase() === cat
    );
  }

  // Filter by minPrice
  if (minPrice !== undefined && minPrice !== "") {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      results = results.filter((item) => item.price >= min);
    }
  }

  // Filter by maxPrice
  if (maxPrice !== undefined && maxPrice !== "") {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      results = results.filter((item) => item.price <= max);
    }
  }

  return res.json({
    total: results.length,
    results,
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Zeerostock Search API is running." });
});

app.listen(PORT, () => {
  console.log(`✅ Assignment A backend running at http://localhost:${PORT}`);
});
