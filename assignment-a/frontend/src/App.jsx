import React, { useState, useCallback } from "react";
import axios from "axios";

const CATEGORIES = ["All", "Construction", "Electrical", "Safety", "Machinery"];

const CATEGORY_COLORS = {
  Construction: "#f97316",
  Electrical:   "#3b82f6",
  Safety:       "#4ade80",
  Machinery:    "#a855f7",
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0a0a0f",
    padding: "0 0 60px",
  },
  header: {
    background: "linear-gradient(135deg, #12121a 0%, #0f0f18 100%)",
    borderBottom: "1px solid #1e1e2e",
    padding: "32px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "28px",
    color: "#f97316",
    letterSpacing: "-0.5px",
  },
  logoSub: { color: "#6b6b7b", fontSize: "13px", fontFamily: "'Space Mono', monospace", marginTop: "2px" },
  badge: {
    background: "#f9731620",
    border: "1px solid #f9731640",
    color: "#f97316",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontFamily: "'Space Mono', monospace",
  },
  main: { maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 0" },
  filterCard: {
    background: "#12121a",
    border: "1px solid #1e1e2e",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "32px",
  },
  filterTitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "11px",
    color: "#6b6b7b",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "20px",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 200px 140px 140px 120px",
    gap: "12px",
    alignItems: "end",
  },
  label: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "10px",
    color: "#6b6b7b",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "8px",
    display: "block",
  },
  input: {
    width: "100%",
    background: "#0a0a0f",
    border: "1px solid #1e1e2e",
    borderRadius: "8px",
    padding: "11px 14px",
    color: "#f1f0ee",
    fontFamily: "'Syne', sans-serif",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    background: "#0a0a0f",
    border: "1px solid #1e1e2e",
    borderRadius: "8px",
    padding: "11px 14px",
    color: "#f1f0ee",
    fontFamily: "'Syne', sans-serif",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
  },
  searchBtn: {
    width: "100%",
    background: "#f97316",
    border: "none",
    borderRadius: "8px",
    padding: "11px 14px",
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.1s",
    letterSpacing: "0.5px",
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  resultsTitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "11px",
    color: "#6b6b7b",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  resultCount: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "12px",
    color: "#f97316",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 6px",
  },
  th: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "10px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#6b6b7b",
    padding: "8px 16px",
    textAlign: "left",
    fontWeight: 400,
  },
  tr: {
    background: "#12121a",
    border: "1px solid #1e1e2e",
    borderRadius: "10px",
    cursor: "default",
  },
  td: {
    padding: "16px",
    fontFamily: "'Syne', sans-serif",
    fontSize: "14px",
    color: "#f1f0ee",
  },
  catBadge: (cat) => ({
    display: "inline-block",
    background: `${CATEGORY_COLORS[cat] || "#6b6b7b"}18`,
    border: `1px solid ${CATEGORY_COLORS[cat] || "#6b6b7b"}40`,
    color: CATEGORY_COLORS[cat] || "#6b6b7b",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontFamily: "'Space Mono', monospace",
    fontWeight: 400,
  }),
  price: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "14px",
    color: "#f97316",
    fontWeight: 700,
  },
  stock: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "12px",
    color: "#4ade80",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#6b6b7b",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "16px" },
  emptyTitle: { fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 600, color: "#f1f0ee", marginBottom: "8px" },
  emptyDesc: { fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#6b6b7b" },
  error: {
    background: "#ff444418",
    border: "1px solid #ff444440",
    color: "#ff6b6b",
    borderRadius: "10px",
    padding: "14px 18px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "13px",
    marginBottom: "20px",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "80px",
    color: "#6b6b7b",
    fontFamily: "'Space Mono', monospace",
    fontSize: "13px",
    gap: "10px",
  },
};

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    setError("");
    setLoading(true);
    setSearched(true);

    // Client-side price validation
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      setError("Invalid price range: Min price cannot be greater than max price.");
      setLoading(false);
      setResults([]);
      return;
    }

    try {
      const params = {};
      if (query.trim()) params.q = query.trim();
      if (category !== "All") params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await axios.get("/search", { params });
      setResults(data.results);
      setTotal(data.total);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to connect to server. Make sure the backend is running on port 5001.");
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, minPrice, maxPrice]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleReset = () => {
    setQuery("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setResults([]);
    setTotal(null);
    setError("");
    setSearched(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>ZEEROSTOCK</div>
          <div style={styles.logoSub}>Surplus Inventory Search Platform</div>
        </div>
        <div style={styles.badge}>Assignment A — Search API</div>
      </header>

      <main style={styles.main}>
        {/* Filter Card */}
        <div style={styles.filterCard}>
          <div style={styles.filterTitle}>Search Filters</div>
          <div style={styles.filterGrid}>
            {/* Search Input */}
            <div>
              <label style={styles.label}>Product Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Steel, Pump, LED..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => (e.target.style.borderColor = "#f97316")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
            </div>

            {/* Category */}
            <div>
              <label style={styles.label}>Category</label>
              <select
                style={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label style={styles.label}>Min Price (₹)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="0"
                value={minPrice}
                min="0"
                onChange={(e) => setMinPrice(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => (e.target.style.borderColor = "#f97316")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
            </div>

            {/* Max Price */}
            <div>
              <label style={styles.label}>Max Price (₹)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="9999"
                value={maxPrice}
                min="0"
                onChange={(e) => setMaxPrice(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => (e.target.style.borderColor = "#f97316")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
            </div>

            {/* Search Button */}
            <div>
              <label style={styles.label}>&nbsp;</label>
              <button
                style={styles.searchBtn}
                onClick={handleSearch}
                onMouseEnter={(e) => (e.target.style.background = "#ea6c0e")}
                onMouseLeave={(e) => (e.target.style.background = "#f97316")}
              >
                Search →
              </button>
            </div>
          </div>

          {searched && (
            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                onClick={handleReset}
                style={{ background: "none", border: "none", color: "#6b6b7b", fontFamily: "'Space Mono', monospace", fontSize: "11px", cursor: "pointer", textDecoration: "underline" }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div style={styles.error}>⚠ {error}</div>}

        {/* Results */}
        {loading ? (
          <div style={styles.spinner}>
            <span>⟳</span> Searching inventory...
          </div>
        ) : searched && !error ? (
          <>
            <div style={styles.resultsHeader}>
              <div style={styles.resultsTitle}>Results</div>
              {total !== null && (
                <div style={styles.resultCount}>{total} item{total !== 1 ? "s" : ""} found</div>
              )}
            </div>

            {results.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📦</div>
                <div style={styles.emptyTitle}>No results found</div>
                <div style={styles.emptyDesc}>Try adjusting your search filters</div>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["#", "Product Name", "Category", "Price", "Stock"].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, idx) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={{ ...styles.td, color: "#6b6b7b", fontFamily: "'Space Mono', monospace", fontSize: "12px", width: "50px" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.td}>
                        <span style={styles.catBadge(item.category)}>{item.category}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.price}>₹{item.price.toLocaleString()}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.stock}>{item.stock.toLocaleString()} units</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : !searched ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <div style={styles.emptyTitle}>Start searching</div>
            <div style={styles.emptyDesc}>Use the filters above and hit Search to find surplus inventory</div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
