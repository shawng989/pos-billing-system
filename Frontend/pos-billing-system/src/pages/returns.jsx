import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Check, X, RotateCcw } from "lucide-react";
import {
  getReturns, createReturn, approveReturn, rejectReturn, getSales, getProducts,
} from "../api/api";

function Returns() {
  const [returns, setReturns] = useState([]);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ sale: "", product: "", quantity: 1, amount: "", reason: "" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [r, s, p] = await Promise.all([getReturns(), getSales(), getProducts()]);
      setReturns(Array.isArray(r) ? r : r.results || []);
      setSales(Array.isArray(s) ? s : s.results || []);
      setProducts(Array.isArray(p) ? p : p.results || []);
    } catch {
      setError("Unable to load return data. Start the Django server first.");
    }
  };
  useEffect(() => { load(); }, []);

  const productMap = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const saleMap = useMemo(() => Object.fromEntries(sales.map((s) => [s.id, s])), [sales]);

  const getSaleItem = (saleId, productId) => {
    const sale = saleMap[saleId];
    return sale?.items?.find((i) => Number(i.product) === Number(productId));
  };

  const filtered = returns.filter((item) => {
    const sale = saleMap[item.sale];
    const product = productMap[item.product];
    const text = `${item.id} ${sale?.invoice_number || ""} ${sale?.customer_name || ""} ${product?.name || ""} ${item.reason || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const availableProducts = saleMap[Number(form.sale)]?.items || [];

  const handleChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "sale") {
      next.product = "";
      next.amount = "";
    }
    if (e.target.name === "product") {
      const item = getSaleItem(Number(form.sale), Number(e.target.value));
      next.amount = item ? Number(item.price) * Number(next.quantity || 1) : "";
    }
    if (e.target.name === "quantity") {
      const item = getSaleItem(Number(form.sale), Number(form.product));
      next.amount = item ? Number(item.price) * Number(e.target.value || 1) : "";
    }
    setForm(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sale || !form.product || !form.reason || !form.amount) {
      return alert("Please fill all fields.");
    }
    try {
      await createReturn({
        sale: Number(form.sale),
        product: Number(form.product),
        quantity: Number(form.quantity),
        refund_amount: Number(form.amount),
        reason: form.reason,
        status: "pending",
      });
      setShowModal(false);
      setForm({ sale: "", product: "", quantity: 1, amount: "", reason: "" });
      await load();
    } catch (err) {
      alert(err.message || "Unable to create return.");
    }
  };

  const changeStatus = async (id, action) => {
    try {
      if (action === "approve") await approveReturn(id);
      else await rejectReturn(id);
      await load();
    } catch (err) {
      alert(err.message || "Unable to update return.");
    }
  };

  return (
    <div className="returns-page">
      <div className="page-header">
        <div><h1>Product Returns</h1><p>Manage customer returns and refund requests.</p></div>
        <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={18} /> New Return</button>
      </div>

      {error && <div className="api-error">{error}</div>}

      <div className="products-toolbar">
        <div className="product-search"><Search size={18} /><input placeholder="Search returns..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="product-count"><RotateCcw size={18} /> {filtered.length} Returns</div>
      </div>

      <div className="dashboard-card">
        <div className="table-container">
          <table>
            <thead><tr><th>Return</th><th>Invoice</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item) => {
                const sale = saleMap[item.sale];
                const product = productMap[item.product];
                return (
                  <tr key={item.id}>
                    <td><strong>RET-{String(item.id).padStart(4, "0")}</strong></td>
                    <td>{sale?.invoice_number || "-"}</td>
                    <td>{sale?.customer_name || "Walk-in Customer"}</td>
                    <td>{product?.name || "-"}</td>
                    <td>{item.quantity}</td>
                    <td>₹{Number(item.refund_amount).toLocaleString("en-IN")}</td>
                    <td>{item.reason}</td>
                    <td><span className={item.status === "completed" ? "status-paid" : item.status === "pending" ? "status-pending" : "status-low"}>{item.status}</span></td>
                    <td><div className="action-buttons">
                      {item.status === "pending" && <>
                        <button className="approve-button" title="Approve and refund" onClick={() => changeStatus(item.id, "approve")}><Check size={16} /></button>
                        <button className="delete-button" title="Reject" onClick={() => changeStatus(item.id, "reject")}><X size={16} /></button>
                      </>}
                      <button className="edit-button" title="View" onClick={() => alert(`Return RET-${String(item.id).padStart(4, "0")}\n\nInvoice: ${sale?.invoice_number || "-"}\nProduct: ${product?.name || "-"}\nAmount: ₹${item.refund_amount}\nStatus: ${item.status}`)}><Eye size={16} /></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div><h2>New Product Return</h2><p>Select an existing invoice and product.</p></div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group"><label>Invoice</label>
                  <select name="sale" value={form.sale} onChange={handleChange}>
                    <option value="">Select invoice</option>
                    {sales.map((s) => <option key={s.id} value={s.id}>{s.invoice_number} — {s.customer_name || "Walk-in"}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Product</label>
                  <select name="product" value={form.product} onChange={handleChange} disabled={!form.sale}>
                    <option value="">Select product</option>
                    {availableProducts.map((item) => <option key={item.product} value={item.product}>{productMap[item.product]?.name || `Product ${item.product}`}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Quantity</label><input type="number" min="1" name="quantity" value={form.quantity} onChange={handleChange} /></div>
                <div className="form-group"><label>Refund Amount</label><input type="number" min="0" name="amount" value={form.amount} onChange={handleChange} /></div>
                <div className="form-group"><label>Reason</label>
                  <select name="reason" value={form.reason} onChange={handleChange}>
                    <option value="">Select reason</option><option>Wrong size</option><option>Damaged product</option><option>Wrong product</option><option>Customer changed mind</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="primary-button">Create Return</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Returns;
