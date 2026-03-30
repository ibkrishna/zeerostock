import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = {
  wrap: { minHeight: "100vh", background: "#080b12", paddingBottom: "60px" },
  header: {
    background: "linear-gradient(135deg, #0f1520 0%, #080b12 100%)",
    borderBottom: "1px solid #1a2035",
    padding: "28px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { fontFamily: "'Syne'", fontWeight: 800, fontSize: "26px", color: "#6366f1" },
  logoSub: { color: "#5a6080", fontSize: "12px", fontFamily: "'Space Mono', monospace", marginTop: "2px" },
  badge: {
    background: "#6366f120",
    border: "1px solid #6366f140",
    color: "#818cf8",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontFamily: "'Space Mono', monospace",
  },
  main: { maxWidth: "1100px", margin: "0 auto", padding: "36px 24px 0" },

  // Tabs
  tabBar: { display: "flex", gap: "4px", marginBottom: "28px", borderBottom: "1px solid #1a2035", paddingBottom: "0" },
  tab: (active) => ({
    padding: "10px 22px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "12px",
    letterSpacing: "0.5px",
    cursor: "pointer",
    border: "none",
    background: "none",
    color: active ? "#6366f1" : "#5a6080",
    borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
    marginBottom: "-1px",
    transition: "color 0.2s",
  }),

  // Cards
  card: {
    background: "#0f1520",
    border: "1px solid #1a2035",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "10px",
    color: "#5a6080",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "20px",
  },

  // Form
  formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" },
  formGrid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px", marginBottom: "14px" },
  label: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "10px",
    color: "#5a6080",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "7px",
    display: "block",
  },
  input: {
    width: "100%",
    background: "#080b12",
    border: "1px solid #1a2035",
    borderRadius: "8px",
    padding: "10px 13px",
    color: "#e8eaf0",
    fontFamily: "'Syne', sans-serif",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    width: "100%",
    background: "#080b12",
    border: "1px solid #1a2035",
    borderRadius: "8px",
    padding: "10px 13px",
    color: "#e8eaf0",
    fontFamily: "'Syne', sans-serif",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  btn: (color = "#6366f1") => ({
    background: color,
    border: "none",
    borderRadius: "8px",
    padding: "10px 22px",
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    letterSpacing: "0.3px",
  }),

  // Table
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 5px" },
  th: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "10px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#5a6080",
    padding: "6px 14px",
    textAlign: "left",
    fontWeight: 400,
  },
  td: {
    padding: "14px",
    fontFamily: "'Syne', sans-serif",
    fontSize: "14px",
    color: "#e8eaf0",
    background: "#0f1520",
    borderTop: "1px solid #1a2035",
    borderBottom: "1px solid #1a2035",
  },
  tdFirst: { borderLeft: "1px solid #1a2035", borderRadius: "8px 0 0 8px" },
  tdLast: { borderRight: "1px solid #1a2035", borderRadius: "0 8px 8px 0" },

  // Alerts
  success: {
    background: "#34d39918",
    border: "1px solid #34d39940",
    color: "#34d399",
    borderRadius: "8px",
    padding: "12px 16px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "12px",
    marginBottom: "14px",
  },
  error: {
    background: "#f8717118",
    border: "1px solid #f8717140",
    color: "#f87171",
    borderRadius: "8px",
    padding: "12px 16px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "12px",
    marginBottom: "14px",
  },

  // Misc
  mono: { fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#6366f1" },
  muted: { fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#5a6080" },
  green: { fontFamily: "'Space Mono', monospace", fontSize: "13px", color: "#34d399", fontWeight: 700 },
  purple: { fontFamily: "'Space Mono', monospace", fontSize: "13px", color: "#818cf8", fontWeight: 700 },
  empty: { textAlign: "center", padding: "60px 20px", color: "#5a6080" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

// ─── SupplierTab ───────────────────────────────────────────────────────────────
function SupplierTab() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      const { data } = await axios.get("/supplier");
      setSuppliers(data.suppliers);
    } catch {
      setErr("Could not load suppliers.");
    }
  }, []);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const handleSubmit = async () => {
    setMsg(null); setErr(null);
    if (!name.trim() || !city.trim()) { setErr("Both name and city are required."); return; }
    try {
      await axios.post("/supplier", { name: name.trim(), city: city.trim() });
      setMsg("Supplier added successfully!");
      setName(""); setCity("");
      fetchSuppliers();
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to add supplier.");
    }
  };

  return (
    <>
      {/* Add Supplier Form */}
      <div style={s.card}>
        <div style={s.cardTitle}>Add New Supplier</div>
        {msg && <div style={s.success}>✓ {msg}</div>}
        {err && <div style={s.error}>⚠ {err}</div>}
        <div style={s.formGrid2}>
          <div>
            <label style={s.label}>Supplier Name</label>
            <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rathi Steel Works" />
          </div>
          <div>
            <label style={s.label}>City</label>
            <input style={s.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" />
          </div>
        </div>
        <button style={s.btn()} onClick={handleSubmit}>Add Supplier →</button>
      </div>

      {/* Supplier List */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={s.cardTitle}>All Suppliers</div>
          <span style={s.mono}>{suppliers.length} total</span>
        </div>
        {suppliers.length === 0 ? (
          <div style={s.empty}>No suppliers yet. Add one above.</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Supplier ID", "Name", "City", "Created"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((sup, i) => (
                <tr key={sup._id}>
                  <td style={{ ...s.td, ...s.tdFirst, ...s.muted, width: "40px" }}>{i + 1}</td>
                  <td style={{ ...s.td, fontFamily: "'Space Mono',monospace", fontSize: "11px", color: "#5a6080" }}>{sup._id}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{sup.name}</td>
                  <td style={s.td}>{sup.city}</td>
                  <td style={{ ...s.td, ...s.tdLast, ...s.muted }}>{new Date(sup.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─── InventoryTab ──────────────────────────────────────────────────────────────
function InventoryTab() {
  const [supplierId, setSupplierId] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [sRes, iRes] = await Promise.all([
        axios.get("/supplier"),
        axios.get("/inventory"),
      ]);
      setSuppliers(sRes.data.suppliers);
      setItems(iRes.data.items);
    } catch {
      setErr("Failed to load data. Is the backend running?");
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSubmit = async () => {
    setMsg(null); setErr(null);
    if (!supplierId || !productName.trim() || quantity === "" || price === "") {
      setErr("All fields are required.");
      return;
    }
    if (Number(quantity) < 0) { setErr("Quantity must be ≥ 0."); return; }
    if (Number(price) <= 0) { setErr("Price must be > 0."); return; }
    try {
      await axios.post("/inventory", {
        supplier_id: supplierId,
        product_name: productName.trim(),
        quantity: Number(quantity),
        price: Number(price),
      });
      setMsg("Inventory item added!");
      setProductName(""); setQuantity(""); setPrice(""); setSupplierId("");
      fetchAll();
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to add item.");
    }
  };

  return (
    <>
      {/* Add Inventory Form */}
      <div style={s.card}>
        <div style={s.cardTitle}>Add Inventory Item</div>
        {msg && <div style={s.success}>✓ {msg}</div>}
        {err && <div style={s.error}>⚠ {err}</div>}
        <div style={s.formGrid3}>
          <div>
            <label style={s.label}>Supplier</label>
            <select style={s.select} value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">— Select Supplier —</option>
              {suppliers.map((sup) => (
                <option key={sup._id} value={sup._id}>{sup.name} ({sup.city})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={s.label}>Product Name</label>
            <input style={s.input} value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Steel Pipes" />
          </div>
          <div>
            <label style={s.label}>Quantity</label>
            <input style={s.input} type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label style={s.label}>Price (₹)</label>
            <input style={s.input} type="number" min="0.01" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          </div>
        </div>
        <button style={s.btn()} onClick={handleSubmit}>Add Item →</button>
      </div>

      {/* Inventory List */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={s.cardTitle}>All Inventory</div>
          <span style={s.mono}>{items.length} items</span>
        </div>
        {items.length === 0 ? (
          <div style={s.empty}>No inventory yet. Add some items above.</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Product", "Supplier", "City", "Qty", "Price", "Value"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item._id}>
                  <td style={{ ...s.td, ...s.tdFirst, ...s.muted, width: "40px" }}>{i + 1}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{item.product_name}</td>
                  <td style={s.td}>{item.supplier_id?.name || "—"}</td>
                  <td style={{ ...s.td, ...s.muted }}>{item.supplier_id?.city || "—"}</td>
                  <td style={{ ...s.td, ...s.mono }}>{item.quantity.toLocaleString()}</td>
                  <td style={{ ...s.td, ...s.purple }}>{fmt(item.price)}</td>
                  <td style={{ ...s.td, ...s.tdLast, ...s.green }}>{fmt(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─── GroupedTab ────────────────────────────────────────────────────────────────
function GroupedTab() {
  const [grouped, setGrouped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({});

  const fetchGrouped = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/inventory/grouped");
      setGrouped(data.grouped);
    } catch {
      setErr("Failed to load grouped data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGrouped(); }, [fetchGrouped]);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading) return <div style={{ ...s.empty, paddingTop: "80px" }}>Loading grouped inventory...</div>;
  if (err) return <div style={{ ...s.error, margin: "20px 0" }}>⚠ {err}</div>;
  if (grouped.length === 0) return <div style={s.empty}>No inventory data yet. Add suppliers and items first.</div>;

  const grandTotal = grouped.reduce((acc, g) => acc + g.totalValue, 0);

  return (
    <>
      {/* Summary Bar */}
      <div style={{ ...s.card, display: "flex", gap: "40px", alignItems: "center" }}>
        <div>
          <div style={s.muted}>Total Suppliers</div>
          <div style={{ ...s.mono, fontSize: "22px", marginTop: "4px" }}>{grouped.length}</div>
        </div>
        <div style={{ width: "1px", height: "40px", background: "#1a2035" }} />
        <div>
          <div style={s.muted}>Grand Inventory Value</div>
          <div style={{ ...s.green, fontSize: "22px", marginTop: "4px" }}>{fmt(grandTotal)}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button style={{ ...s.btn(), fontSize: "12px", padding: "8px 16px" }} onClick={fetchGrouped}>↻ Refresh</button>
        </div>
      </div>

      {/* Grouped Cards */}
      {grouped.map((group, rank) => {
        const isOpen = expanded[group.supplier._id];
        const pct = grandTotal > 0 ? (group.totalValue / grandTotal) * 100 : 0;
        return (
          <div key={group.supplier._id} style={{ ...s.card, marginBottom: "12px" }}>
            {/* Header Row */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }}
              onClick={() => toggle(group.supplier._id)}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#6366f120", border: "1px solid #6366f140",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Mono',monospace", fontSize: "12px", color: "#818cf8",
                flexShrink: 0,
              }}>
                #{rank + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "16px" }}>{group.supplier.name}</div>
                <div style={{ ...s.muted, marginTop: "2px" }}>{group.supplier.city}</div>
              </div>
              <div style={{ textAlign: "right", marginRight: "16px" }}>
                <div style={s.green}>{fmt(group.totalValue)}</div>
                <div style={s.muted}>{group.totalItems} item{group.totalItems !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ width: "120px" }}>
                <div style={{ background: "#1a2035", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#6366f1", borderRadius: "4px" }} />
                </div>
                <div style={{ ...s.muted, marginTop: "4px", textAlign: "right" }}>{pct.toFixed(1)}%</div>
              </div>
              <div style={{ color: "#5a6080", fontSize: "18px", marginLeft: "8px" }}>{isOpen ? "▲" : "▼"}</div>
            </div>

            {/* Expanded Items */}
            {isOpen && (
              <div style={{ marginTop: "16px", borderTop: "1px solid #1a2035", paddingTop: "16px" }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {["Product", "Quantity", "Unit Price", "Item Value"].map((h) => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.items
                      .sort((a, b) => b.itemValue - a.itemValue)
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ ...s.td, ...s.tdFirst, fontWeight: 600 }}>{item.product_name}</td>
                          <td style={{ ...s.td, ...s.mono }}>{item.quantity.toLocaleString()}</td>
                          <td style={{ ...s.td, ...s.purple }}>{fmt(item.price)}</td>
                          <td style={{ ...s.td, ...s.tdLast, ...s.green }}>{fmt(item.itemValue)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
const TABS = ["Suppliers", "Inventory", "Grouped by Value"];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <div>
          <div style={s.logo}>ZEEROSTOCK</div>
          <div style={s.logoSub}>Supplier Inventory Database</div>
        </div>
        <div style={s.badge}>Assignment B — Database API</div>
      </header>

      <main style={s.main}>
        <div style={s.tabBar}>
          {TABS.map((t, i) => (
            <button key={t} style={s.tab(activeTab === i)} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>

        {activeTab === 0 && <SupplierTab />}
        {activeTab === 1 && <InventoryTab />}
        {activeTab === 2 && <GroupedTab />}
      </main>
    </div>
  );
}
